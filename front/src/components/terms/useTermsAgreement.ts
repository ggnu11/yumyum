import {useState} from 'react';
import {TermsItem} from './types';

export const useTermsAgreement = () => {
  const [termsItems, setTermsItems] = useState<TermsItem[]>([
    {
      id: 'all',
      title: '서비스 이용약관 전체동의',
      isRequired: false,
      isChecked: false,
    },
    {
      id: 'terms',
      title: '이용약관 (필수)',
      isRequired: true,
      isChecked: false,
      hasDetail: true,
      detailType: 'terms',
      detailTitle: '이용약관',
    },
    {
      id: 'privacy',
      title: '개인정보처리방침 (필수)',
      isRequired: true,
      isChecked: false,
      hasDetail: true,
      detailType: 'privacy',
      detailTitle: '개인정보처리방침',
    },
    {
      id: 'location',
      title: '위치기반서비스 이용약관 (필수)',
      isRequired: true,
      isChecked: false,
      hasDetail: true,
      detailType: 'location',
      detailTitle: '위치기반서비스 이용약관',
    },
    {
      id: 'age',
      title: '만 14세 이상 확인 (필수)',
      isRequired: true,
      isChecked: false,
    },
    {
      id: 'marketing',
      title: '마케팅 정보 수신 동의 (선택)',
      isRequired: false,
      isChecked: false,
      hasDetail: true,
      detailType: 'marketing',
      detailTitle: '마케팅 정보 수신 동의',
    },
  ]);

  const handleItemCheck = (id: string) => {
    if (id === 'all') {
      const newCheckedState = !termsItems[0].isChecked;
      setTermsItems(prev =>
        prev.map(item => ({...item, isChecked: newCheckedState})),
      );
    } else {
      setTermsItems(prev => {
        const newItems = prev.map(item =>
          item.id === id ? {...item, isChecked: !item.isChecked} : item,
        );

        // 전체동의 체크박스 상태 업데이트
        const allItemsExceptFirst = newItems.slice(1);
        const allChecked = allItemsExceptFirst.every(item => item.isChecked);
        newItems[0].isChecked = allChecked;

        return newItems;
      });
    }
  };

  const isRequiredTermsChecked = () => {
    return termsItems
      .filter(item => item.isRequired)
      .every(item => item.isChecked);
  };

  return {
    termsItems,
    handleItemCheck,
    isRequiredTermsChecked,
  };
};
