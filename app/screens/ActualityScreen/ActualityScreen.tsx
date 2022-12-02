import { useEffect, useMemo, useState } from 'react';
import { List } from 'react-native-paper';
import { ScrollView, StyleSheet, RefreshControl, View } from 'react-native';
import { map, reject } from 'lodash/collection';
import { useQuery } from '@tanstack/react-query';
import { Loader, EmptyState } from '@/components';
import * as storage from '@/utils/storage';
import { useStores } from '@/models';
import { IActuality } from '@/screens/ActualityScreen/ActualityScreen.types';
import ActualityBottomSheet from '@/screens/ActualityScreen/ActualityBottomSheet';

const OPENED_ITEMS_KEY = 'opened_actualities_sections';
const loaderScreen = <Loader />;

export function ActualityScreen() {
  const { loadActualitiesSections } = useStores().actualityStore;
  const [openedItems, setOpenedItems] = useState<string[]>([]);
  const [openedActuality, setOpenedActuality] = useState<IActuality>(null);
  const { data, refetch, isLoading, isRefetching, isError } = useQuery(['actualities_sections'], loadActualitiesSections);
  const showEmptyState = useMemo(() => !data || isError, [data, isError]);

  useEffect(() => {
    storage
      .load(OPENED_ITEMS_KEY, [])
      .then(setOpenedItems);
  }, []);

  const toggleSection = (sectionId) => {
    const isOpened = openedItems.includes(sectionId);
    const newOpenedItems = isOpened
      ? reject(openedItems, (id) => id === sectionId)
      : [...openedItems, sectionId];

    setOpenedItems(newOpenedItems);
    storage.save(OPENED_ITEMS_KEY, newOpenedItems);
  };

  if (isLoading)
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
          { map(data, (section) => (
            <List.Accordion
              key={ section._id }
              title={ `${section.name} (${section.actualities.length})` }
              expanded={ openedItems.includes(section._id) }
              onPress={ () => toggleSection(section._id) }
            >
              { map(section.actualities, (actuality, childIndex) => (
                <List.Item
                  key={ childIndex }
                  description={ `updated at ${actuality.updatedAt}` }
                  title={ actuality.name }
                  onPress={ () => setOpenedActuality(actuality) }
                />
              ))}
            </List.Accordion>
          ))}
        </List.Section>
      </ScrollView>

      <ActualityBottomSheet
        actuality={ openedActuality }
        onClose={ () => setOpenedActuality(null) }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
});
