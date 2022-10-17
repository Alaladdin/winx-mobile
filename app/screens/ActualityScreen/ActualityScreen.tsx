import React, { useCallback, useMemo, useRef, useState } from 'react';
import { List, Text } from 'react-native-paper';
import { ScrollView, StyleSheet, RefreshControl, View, Image } from 'react-native';
import { map, reject } from 'lodash/collection';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { api } from '@/services/api';
import { LoaderScreen } from '@/components';
import { useStores } from '@/models';
import { IActuality, IActualitySection } from './ActualityScreen.interfaces';
import theme from '@/theme';
import config from '@/config';

export function ActualityScreen() {
  const { settingsStore } = useStores();
  const [expanded, setExpanded] = useState([]);
  const [actualities, setActualities] = useState<IActualitySection[]>(null);
  const [actuality, setActuality] = useState<IActuality>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isLoading, setLoading] = useState(false);
  const [isRefreshing, setRefreshing] = React.useState(false);
  const snapPoints = useMemo(() => ['33%', '66%', '100%'], []);
  const loaderScreenMemoized = useMemo(() => <LoaderScreen />, [isLoading]);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setActualities(null);
  }, []);

  if (actualities === null && !isLoading) {
    setLoading(true);

    api.get('/getActualitiesSections')
      .then((data) => {
        setActualities(data.sections);
      })
      .finally(() => {
        const delay = settingsStore.needSlowDownAnimation ? 1000 : 0;

        setTimeout(() => {
          setRefreshing(false);
          setLoading(false);
        }, delay);
      });
  }

  const loadActuality = (actualityId: string) => {
    api.get('/getActuality', { actualityId })
      .then((data) => {
        setActuality(data.actuality);
        bottomSheetRef.current.snapToIndex(1);
      });
  };

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

  if (isLoading || !actualities)
    return loaderScreenMemoized;

  const handlePress = (sectionIndex) => {
    if (expanded.includes(sectionIndex))
      setExpanded(reject(expanded, (index) => index === sectionIndex));
    else
      setExpanded([...expanded, sectionIndex]);
  };

  return (
    <View style={ styles.container }>
      <ScrollView
        style={ { minHeight: '100%' } }
        refreshControl={ <RefreshControl refreshing={ isRefreshing } onRefresh={ onRefresh } /> }
      >
        <List.Section>
          { map(actualities, (section, sectionIndex) => (
            <List.Accordion
              key={ sectionIndex }
              title={ section.name }
              left={ (props) => <List.Icon { ...props } icon="folder" /> }
              expanded={ expanded.includes(sectionIndex) }
              onPress={ () => handlePress(sectionIndex) }
            >
              { map(section.actualities, (actuality, actualityIndex) => (
                <List.Item
                  key={ actualityIndex }
                  title={ actuality.name }
                  onPress={ () => loadActuality(actuality._id) }
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
        enablePanDownToClose
      >
        {
          actuality && (
            <BottomSheetScrollView style={ [styles.sheetContainer, styles.sheetBackgroundColor] }>
              <View style={ styles.sheetHeader }>
                <Text>{ actuality.updatedBy.displayName || actuality.updatedBy.username || 'DELETED' }</Text>
                <Image source={ { uri: config.avatarBaseUrl + actuality.updatedBy.avatar, width: 32, height: 32 } } />
              </View>
              <Text>{ actuality.data || 'No content :(' }</Text>
            </BottomSheetScrollView>
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
    backgroundColor: theme.colors.neutral20,
  },
  sheetHeader: {
    flexDirection : 'row',
    justifyContent: 'space-between',
    alignItems    : 'center',
    marginBottom  : 20,
  },
});
