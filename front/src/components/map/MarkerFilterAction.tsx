import {MARKER_CATEGORIES} from '@/constants/markerIcons';
import useFilterStore from '@/store/filter';
import useThemeStore from '@/store/theme';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ActionSheet} from '../common/ActionSheet';
import FoodMarker from '../common/FoodMarker';

interface MarkerFilterActionProps {
  isVisible: boolean;
  hideAction: () => void;
}

function MarkerFilterAction({isVisible, hideAction}: MarkerFilterActionProps) {
  const {theme} = useThemeStore();
  const [filterCondition, setFilterCondition] = useState('카테고리');
  const {filters, setFilters} = useFilterStore();

  const handleFilter = (name: string) => {
    setFilters({...filters, [name]: !filters[name]});
  };

  return (
    <ActionSheet
      isVisible={isVisible}
      hideAction={hideAction}>
      <ActionSheet.Background>
        <ActionSheet.Container>
          <ActionSheet.Title>마커 필터링</ActionSheet.Title>
          <ActionSheet.Divider />
          <View style={styles.filterContainer}>
            {['카테고리', '평점'].map(condition => (
              <ActionSheet.Filter
                key={condition}
                isSelected={filterCondition === condition}
                onPress={() => setFilterCondition(condition)}>
                {condition}
              </ActionSheet.Filter>
            ))}
          </View>
          <ActionSheet.Divider />
          {filterCondition === '카테고리' && (
            <>
              {MARKER_CATEGORIES.map(({key, label}) => (
                <ActionSheet.CheckBox
                  key={key}
                  isChecked={filters[key]}
                  onPress={() => handleFilter(key)}
                  icon={
                    <View style={styles.markerIcon}>
                      <FoodMarker category={key} score={4} size={28} />
                    </View>
                  }>
                  {label}
                </ActionSheet.CheckBox>
              ))}
            </>
          )}
          {filterCondition === '평점' && (
            <>
              {['1', '2', '3', '4', '5'].map(score => (
                <ActionSheet.CheckBox
                  key={score}
                  isChecked={filters[score]}
                  onPress={() => handleFilter(score)}>
                  {score}점
                </ActionSheet.CheckBox>
              ))}
            </>
          )}
          <ActionSheet.Divider />
          <ActionSheet.Button onPress={hideAction}>완료</ActionSheet.Button>
        </ActionSheet.Container>
      </ActionSheet.Background>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-around',
  },
  markerIcon: {
    width: 28,
    height: 28,
  },
});

export default MarkerFilterAction;
