# Apple Sign In 정책 준수 구현 가이드

#### ✅ 세션 관리 훅 (`useAppleSignInState`)

```typescript
// 주요 기능
- checkAvailability(): Apple Sign In 지원 확인
- checkCredentialState(): 사용자 계정 상태 확인
- performReSignIn(): 재로그인 수행
- getCredentialStateMessage(): 상태별 사용자 메시지
```

## 📁 수정된 파일 목록

### 1. `/src/api/auth.ts`

- `RequestAppleIdentity` 타입 정의 개선
- Apple 계정 해제 API (`revokeAppleToken`) 추가

### 2. `/src/screens/auth/AuthHomeScreen.tsx`

- Apple 로그인 로직 정책 준수로 개선
- 에러 처리 및 사용자 경험 향상
- Apple Sign In 상태 관리 적용

### 3. `/src/hooks/useAppleSignInState.ts` (신규)

- Apple Sign In 상태 관리 전용 훅
- 재로그인 및 세션 관리 기능
- Apple 계정 상태 실시간 감지

### 4. `/src/hooks/queries/useAuth.ts`

- Apple 계정 해제 API 연동

## 🔧 사용법

### 기본 로그인

```typescript
const handleAppleLogin = async () => {
  try {
    const result = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // 정책에 맞는 데이터 전송
    appleLoginMutation.mutate({
      identityToken: result.identityToken,
      appId: 'com.matzip.app',
      email: result.email,
      name: result.fullName,
    });
  } catch (error) {
    // 에러 처리
  }
};
```

### Apple Sign In 상태 관리

```typescript
const {isAvailable, credentialState, checkCredentialState, performReSignIn} =
  useAppleSignInState();

// 사용자 상태 확인
await checkCredentialState(userId);

// 재로그인 수행
await performReSignIn();
```

## ⚠️ 중요 고려사항

### 1. 서버 측 구현 필요

- **JWT 토큰 검증**: Apple 공개키로 identityToken 검증 필수
- **릴레이 이메일 처리**: `@privaterelay.appleid.com` 도메인 이메일 처리
- **계정 해제 API**: `/auth/oauth/apple/revoke` 엔드포인트 구현

### 2. 정보 갱신 제한

- **최초 로그인만**: 이름과 이메일은 최초 로그인 시에만 제공
- **YUMYUM 내 관리**: 닉네임 등은 앱 내에서만 변경 가능

### 3. 정책 준수 체크리스트

- [x] Apple 표준 버튼 사용
- [x] 다른 SSO와 동등 배치
- [x] 최소 정보만 요청 (이름, 이메일)
- [x] 이메일 가리기 지원
- [x] 재로그인 간편화
- [x] 세션 상태 관리
- [x] 계정 해제 기능
- [x] 에러 처리 개선

## 🚀 다음 단계

1. **서버 API 구현**: Apple JWT 검증 및 계정 해제 API 개발
2. **테스트**: 실제 Apple ID로 로그인/탈퇴 테스트
3. **앱스토어 심사**: Apple 정책 준수 확인
4. **모니터링**: Apple Sign In 사용 현황 및 오류 모니터링
