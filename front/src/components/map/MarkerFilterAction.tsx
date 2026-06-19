import {colors} from '@/constants/colors';
import useFilterStore from '@/store/filter';
import useThemeStore from '@/store/theme';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {ActionSheet} from '../common/ActionSheet';

interface MarkerFilterActionProps {
  isVisible: boolean;
  hideAction: () => void;
}

function MarkerFilterAction({isVisible, hideAction}: MarkerFilterActionProps) {
  const {t} = useTranslation();
  const {theme} = useThemeStore();
  const [filterCondition, setFilterCondition] = useState('color');
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
          <ActionSheet.Title>{t('filter.markerFilter')}</ActionSheet.Title>
          <ActionSheet.Divider />
          <View style={styles.filterContainer}>
            {['color', 'score'].map(condition => (
              <ActionSheet.Filter
                key={condition}
                isSelected={filterCondition === condition}
                onPress={() => setFilterCondition(condition)}>
                {t(`filter.${condition}`)}
              </ActionSheet.Filter>
            ))}
          </View>
          <ActionSheet.Divider />
          {filterCondition === 'color' && (
            <>
              {[
                colors[theme].PINK_400,
                colors[theme].YELLOW_400,
                colors[theme].GREEN_400,
                colors[theme].BLUE_400,
                colors[theme].PURPLE_400,
              ].map(color => (
                <ActionSheet.CheckBox
                  key={color}
                  isChecked={filters[color]}
                  onPress={() => handleFilter(color)}
                  icon={
                    <View style={[styles.marker, {backgroundColor: color}]} />
                  }
                />
              ))}
            </>
          )}
          {filterCondition === 'score' && (
            <>
              {['1', '2', '3', '4', '5'].map(score => (
                <ActionSheet.CheckBox
                  key={score}
                  isChecked={filters[score]}
                  onPress={() => handleFilter(score)}>
                  {t('post.scoreUnit', {score})}
                </ActionSheet.CheckBox>
              ))}
            </>
          )}
          <ActionSheet.Divider />
          <ActionSheet.Button onPress={hideAction}>{t('filter.done')}</ActionSheet.Button>
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
  marker: {
    width: 20,
    height: 20,
    borderRadius: 20,
  },
});

export default MarkerFilterAction;
