// Supabase를 사용하면 자동으로 Authorization 헤더가 추가되므로
// 별도로 헤더를 설정할 필요가 없습니다.
// 하지만 기존 코드와의 호환성을 위해 빈 함수로 유지합니다.

function setHeader(_key: string, _value: string) {
  // Supabase는 자동으로 헤더를 관리하므로 별도 설정 불필요
}

function removeHeader(_key: string) {
  // Supabase는 자동으로 헤더를 관리하므로 별도 제거 불필요
}

export {setHeader, removeHeader};
