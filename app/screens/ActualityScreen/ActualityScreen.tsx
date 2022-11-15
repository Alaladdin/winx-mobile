import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { List, Text, ActivityIndicator } from 'react-native-paper';
import { ScrollView, StyleSheet, RefreshControl, View, Image } from 'react-native';
import { map, reject } from 'lodash/collection';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Icon, Loader } from '@/components';
import { IActuality, IActualitySection } from './ActualityScreen.interfaces';
import theme from '@/theme';
import config from '@/config';
import { EmptyState } from '@/components/EmptyState';
import * as storage from '@/utils/storage';

const OPENED_ITEMS_KEY = 'opened_actualities_sections';

const folderIcon = <Icon ripperStyle={ { padding: 15 } } size={ 20 } icon="folder" />;
const loaderScreen = <Loader />;
const loadActualitiesSections = (): Promise<IActualitySection[]> => api.get('/getActualitiesSections')
  .then((data) => data.sections);

const loadActuality = (actualityId): Promise<IActuality> => api.get('/getActuality', { actualityId })
  .then((data) => data.actuality);

export function ActualityScreen() {
  const [openedItems, setOpenedItems] = useState([]);
  const [actualityId, setActualityId] = useState(null);
  const { data, refetch, isLoading, isRefetching, isError, isRefetchError } = useQuery(['actualities_sections'], loadActualitiesSections);
  const { data: actualityItem } = useQuery(
    ['actuality_item', actualityId],
    ({ queryKey }) => loadActuality(queryKey[1]),
    { enabled: !!actualityId }
  );
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%', '100%'], []);
  const showLoader = useMemo(() => isLoading || isRefetching, [isLoading, isRefetching]);
  const showEmptyState = useMemo(() => !data || isError || isRefetchError, [data, isError, isRefetchError]);

  useEffect(() => {
    storage
      .load(OPENED_ITEMS_KEY, [])
      .then(setOpenedItems);
  }, []);

  useEffect(() => {
    if (actualityId)
      bottomSheetRef.current.snapToIndex(0);
  }, [actualityId]);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        { ...props }
        disappearsOnIndex={ -1 }
        appearsOnIndex={ 1 }
      />
    ),
    []
  );

  const toggleSection = (sectionIndex) => {
    const isOpened = openedItems.includes(sectionIndex);
    const newOpenedItems = isOpened
      ? reject(openedItems, (index) => index === sectionIndex)
      : [...openedItems, sectionIndex];

    setOpenedItems(newOpenedItems);
    storage.save(OPENED_ITEMS_KEY, newOpenedItems);
  };

  if (showLoader)
    return loaderScreen;

  if (showEmptyState)
    return <EmptyState buttonProps={ { onPress: refetch } } />;

  return (
    <View style={ styles.container }>
      <ScrollView
        style={ { minHeight: '100%' } }
        refreshControl={ <RefreshControl refreshing={ isRefetching } onRefresh={ refetch } /> }
      >
        <List.Section>
          { map(data, (section, index) => (
            <List.Accordion
              key={ index }
              title={ section.name }
              left={ () => folderIcon }
              expanded={ openedItems.includes(index) }
              onPress={ () => toggleSection(index) }
            >
              { map(section.actualities, (actuality, childIndex) => (
                <List.Item
                  key={ childIndex }
                  title={ actuality.name }
                  onPress={ () => setActualityId(actuality._id) }
                />
              ))}
            </List.Accordion>
          ))}
        </List.Section>
      </ScrollView>

      <BottomSheet
        ref={ bottomSheetRef }
        index={ -1 }
        snapPoints={ snapPoints }
        backdropComponent={ renderBackdrop }
        backgroundStyle={ styles.sheetBackgroundColor }
        onClose={ () => setActualityId(null) }
        enablePanDownToClose
      >
        {
          actualityItem ? (
            <BottomSheetScrollView style={ [styles.sheetContainer, styles.sheetBackgroundColor] }>
              <View style={ styles.sheetHeader }>
                <Text>{ actualityItem.updatedBy.displayName || actualityItem.updatedBy.username || 'DELETED' }</Text>
                <Image source={ { uri: config.avatarBaseUrl + actualityItem.updatedBy.avatar, width: 32, height: 32 } } />
              </View>
              <Text>{ actualityItem.data || 'No content :(' }</Text>
            </BottomSheetScrollView>
          ) : (
            <View style={ { marginTop: 150 } }>
              <ActivityIndicator size="large" animating />
            </View>
          )
        }
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  sheetContainer: {
    padding     : 20,
    marginBottom: 20,
  },
  sheetBackgroundColor: {
    backgroundColor: theme.colors.elevation.level3,
  },
  sheetHeader: {
    flexDirection : 'row',
    justifyContent: 'space-between',
    alignItems    : 'center',
    marginBottom  : 20,
  },
});
