import React from 'react';
import {View, StyleSheet} from 'react-native';

import RecordCard from './RecordCard';
import {FilterType} from './FeedFilterSection';

interface RecordData {
  id: number;
  title: string;
  content: string;
  date: string;
  images?: string[];
  isOwner: boolean;
  author?: {
    name: string;
    profileImage?: string;
  };
}

interface RecordsListProps {
  records: RecordData[];
  activeFilter: FilterType;
  isExpanded?: boolean;
  onEditRecord?: (recordId: number) => void;
  onDeleteRecord?: (recordId: number) => void;
}

function RecordsList({
  records,
  activeFilter,
  isExpanded = false,
  onEditRecord,
  onDeleteRecord,
}: RecordsListProps) {
  // 필터에 따라 레코드 필터링
  const filteredRecords = records.filter(record => {
    if (activeFilter === 'mine') {
      return record.isOwner;
    }
    return true; // 'all'인 경우 모든 레코드 표시
  });

  return (
    <View style={styles.recordsList}>
      {filteredRecords.map(record => (
        <RecordCard
          key={record.id}
          record={record}
          isExpanded={isExpanded}
          onEdit={onEditRecord}
          onDelete={onDeleteRecord}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  recordsList: {
    paddingBottom: 100, // 하단 버튼 공간 확보
  },
});

export default RecordsList;
