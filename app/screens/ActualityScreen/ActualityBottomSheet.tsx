import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Image, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import config from '@/config';
import { MarkdownViewer } from '@/components';
import { IActualityBottomSheetProps } from './ActualityScreen.types';
import theme from '@/theme';

export default function ({ actuality, onClose }: IActualityBottomSheetProps) {
  const snapPoints = useMemo(() => ['50%', '100%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const avatarSourceOptions = useMemo(() => {
    const { updatedBy } = actuality || {};

    return {
      uri   : `${config.imageBaseUrl}${updatedBy?.avatar}`,
      width : 32,
      height: 32,
    };
  }, [actuality]);

  const renderBackdrop = useCallback((props) => (
    <BottomSheetBackdrop
      { ...props }
      disappearsOnIndex={ -1 }
      appearsOnIndex={ 1 }
    />
  ), []);

  const sheetHeaderInfo = useMemo(() => {
    const { updatedAt, updatedBy } = actuality || {};

    return (
      <View style={ styles.sheetHeaderInfo }>
        <View style={ { flexDirection: 'row', marginRight: 10 } }>
          <Text>Updated at </Text>
          <Text>{ updatedAt }</Text>
        </View>

        <View style={ styles.sheetHeaderAvatar }>
          <Text>by </Text>
          <Text style={ { marginRight: 10 } }>
            { updatedBy?.displayName }
          </Text>

          <Image
            borderRadius={ 50 }
            source={ avatarSourceOptions }
          />
        </View>
      </View>
    );
  }, [actuality]);

  useEffect(() => {
    if (actuality)
      bottomSheetRef.current?.snapToIndex(0);
  }, [actuality]);

  return (
    <BottomSheet
      ref={ bottomSheetRef }
      index={ -1 }
      snapPoints={ snapPoints }
      backdropComponent={ renderBackdrop }
      backgroundStyle={ styles.sheetBackgroundColor }
      handleIndicatorStyle={ { backgroundColor: '#fff' } }
      enablePanDownToClose
      onClose={ onClose }
    >
      {
        actuality ? (
          <BottomSheetScrollView style={ [styles.sheetContainer] }>
            <View style={ styles.sheetHeader }>
              <Text variant="titleMedium" numberOfLines={ 1 } style={ { paddingHorizontal: 20 } }>
                { actuality.name }
              </Text>
              { sheetHeaderInfo }
            </View>
            <MarkdownViewer style={ { paddingHorizontal: 20 } }>{ actuality.data || 'Nothing there' }</MarkdownViewer>
          </BottomSheetScrollView>
        ) : (
          <View style={ { marginTop: 150 } }>
            <ActivityIndicator size="large" animating />
          </View>
        )
      }
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    marginBottom: 20,
  },
  sheetBackgroundColor: {
    backgroundColor: theme.colors.elevation.level3,
  },
  sheetHeader: {
    flexDirection    : 'column',
    justifyContent   : 'space-between',
    alignItems       : 'center',
    marginBottom     : 20,
    paddingVertical  : 7,
    borderRadius     : theme.roundness,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondaryContainer,
  },
  sheetHeaderInfo: {
    flexDirection    : 'row',
    justifyContent   : 'space-between',
    alignItems       : 'center',
    paddingTop       : 15,
    paddingBottom    : 5,
    paddingHorizontal: 20,
    width            : '100%',
  },
  sheetHeaderAvatar: {
    flexDirection : 'row',
    justifyContent: 'center',
    alignItems    : 'center',
  },
});
