# Google Sign In 정책 준수 구현 가이드

## 개요

YUMYUM 앱의 Google Sign In 기능이 Google의 Identity Platform UI Guidelines 및 개발 가이드라인을 완전히 준수하도록 구현되었습니다.

## 🎯 구현된 주요 기능

### 1. 화면 및 UX 정책 준수

#### ✅ 로그인 버튼 (Sign In Button)

- **Google 표준 버튼 사용**: `GoogleSigninButton` 컴포넌트를 통해 Google 제공 표준 디자인 적용
- **동등 배치**: Apple, 카카오, 네이버 로그인 버튼과 동일한 크기와 여백으로 배치
- **접근성**: 로딩 상태에서 버튼 비활성화 처리

#### ✅ 정보 요청 화면

- **최소 필수 정보 요청**: 프로필 정보(이름, 프로필 사진)와 이메일 정보 요청
- **사용자 동의**: Google 시스템을 통한 명확한 정보 공유 동의 프로세스
- **필수 정보 검증**: id, email이 없는 경우 로그인 거부

#### ✅ 재로그인/세션 관리

- **간편 재로그인**: 기존 사용자는 `signInSilently`를 통한 자동 로그인
- **토큰 자동 갱신**: Google SDK를 통한 토큰 자동 갱신 지원
- **세션 상태 관리**: 실시간 로그인 상태 감지

### 2. 데이터 처리 정책 준수

#### ✅ 수집 정보 및 매핑

```typescript
type RequestGoogleIdentity = {
  idToken: string; // 필수: Google JWT 토큰
  id: string; // 필수: Google 고유 식별자
  email: string; // 필수: 이메일 주소
  name?: string; // 선택: 사용자 이름
  photoUrl?: string; // 선택: 프로필 사진 URL
};
```

#### ✅ 정보 처리 방식

- **social_id 매핑**: Google의 `id`를 YUMYUM의 `social_id`로 저장
- **이메일 저장**: Google 계정 이메일을 User 테이블 `email` 필드에 저장
- **닉네임 처리**: Google 이름을 직접 닉네임으로 사용하지 않고, 시스템 생성 닉네임 사용
- **프로필 사진**: Google 프로필 사진 URL을 초기값으로 저장, 추후 변경 가능

#### ✅ 계정 삭제/탈퇴 지원

- **연결 해제 API**: `revokeGoogleToken` 함수를 통한 Google 연결 해제
- **완전 삭제**: 사용자 탈퇴 시 Google과의 연결 완전 차단

### 3. 기술적 구현 사항

#### ✅ 세션 관리 훅 (`useGoogleSignInState`)

```typescript
// 주요 기능
- configureGoogleSignIn(): Google Sign-In 초기 설정
- checkSignInState(): 현재 로그인 상태 확인
- performSignIn(): 새 로그인 수행
- tryAutoSignIn(): 자동 로그인 시도 (세션 복원)
- signOut(): 로그아웃
- revokeAccess(): 계정 연결 완전 해제
- getCurrentUser(): 현재 사용자 정보
- getTokens(): 액세스 토큰 가져오기
```

#### ✅ 에러 처리 개선

- **사용자 취소**: `CANCELLED` 에러 시 별도 메시지 표시 안함
- **Play Services 확인**: Android에서 Google Play Services 가용성 확인
- **상세 에러 로깅**: 개발자용 console.error 추가
- **사용자 친화적 메시지**: 일반적인 에러 상황에 대한 안내

#### ✅ 플랫폼별 고려사항

- **iOS/Android 호환**: 양 플랫폼에서 동일한 API 제공
- **웹 클라이언트 ID**: 서버 측 토큰 검증을 위한 웹 클라이언트 ID 설정
- **오프라인 액세스**: 리프레시 토큰을 위한 오프라인 액세스 활성화

## 📁 수정/추가된 파일 목록

### 1. `/src/api/auth.ts`

- `RequestGoogleIdentity` 타입 정의
- Google 로그인 API (`googleLogin`) 추가
- Google 계정 해제 API (`revokeGoogleToken`) 추가

### 2. `/src/screens/auth/AuthHomeScreen.tsx`

- Google 로그인 로직 정책 준수로 구현
- Google Sign-In 버튼 추가
- 에러 처리 및 사용자 경험 향상

### 3. `/src/hooks/useGoogleSignInState.ts` (신규)

- Google Sign-In 상태 관리 전용 훅
- 자동 로그인 및 세션 관리 기능
- 토큰 관리 및 갱신 기능

### 4. `/src/hooks/queries/useAuth.ts`

- Google 로그인 mutation 추가
- Google 계정 해제 API 연동

### 5. `package.json`

- `@react-native-google-signin/google-signin` 패키지 추가

## 🔧 사용법

### 기본 로그인

```typescript
const handleGoogleLogin = async () => {
  try {
    const result = await performGoogleSignIn();

    // 정책에 맞는 데이터 전송
    googleLoginMutation.mutate({
      idToken: result.idToken,
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      photoUrl: result.user.photo,
    });
  } catch (error) {
    // 에러 처리
  }
};
```

### Google Sign-In 상태 관리

```typescript
const {
  isSignedIn,
  isConfigured,
  performSignIn,
  tryAutoSignIn,
  signOut,
  revokeAccess,
} = useGoogleSignInState();

// 자동 로그인 시도
await tryAutoSignIn();

// 로그아웃
await signOut();

// 계정 연결 해제 (탈퇴 시)
await revokeAccess();
```

## ⚠️ 중요 고려사항

### 1. 초기 설정 필요

```typescript
await GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  offlineAccess: true,
  hostedDomain: '', // 필요 시 도메인 제한
  forceCodeForRefreshToken: true, // Android 리프레시 토큰
});
```

### 2. 서버 측 구현 필요

- **JWT 토큰 검증**: Google 공개키로 idToken 검증 필수
- **사용자 정보 처리**: Google에서 제공하는 사용자 정보 매핑
- **계정 해제 API**: `/auth/oauth/google/revoke` 엔드포인트 구현

### 3. Google API Console 설정

- **OAuth 2.0 클라이언트 ID**: 웹, iOS, Android 클라이언트 ID 생성
- **스코프 설정**: `profile`, `email` 스코프 설정
- **승인된 도메인**: 앱의 도메인 추가

### 4. 정책 준수 체크리스트

- [x] Google 표준 버튼 사용
- [x] 다른 SSO와 동등 배치
- [x] 필수 정보만 요청 (프로필, 이메일)
- [x] 사용자 동의 명확화
- [x] 재로그인 간편화
- [x] 세션 상태 관리
- [x] 계정 해제 기능
- [x] 에러 처리 개선
- [x] Play Services 호환성

## 🚀 다음 단계

1. **환경 설정**: Google API Console에서 클라이언트 ID 설정
2. **서버 API 구현**: Google JWT 검증 및 계정 해제 API 개발
3. **테스트**: 실제 Google 계정으로 로그인/탈퇴 테스트
4. **정책 검토**: Google의 최신 가이드라인 준수 확인
5. **앱스토어 배포**: 정책 준수 상태로 배포

## 📋 환경별 설정 가이드

### iOS 설정

1. `ios/Runner/Info.plist`에 URL 스키마 추가
2. Google Services 설정 파일 추가
3. Xcode 프로젝트 설정 업데이트

### Android 설정

1. `android/app/build.gradle`에 Google Services 플러그인 추가
2. SHA-1 인증서 지문을 Google Console에 등록
3. Google Services JSON 파일 추가

---

이 구현을 통해 YUMYUM 앱이 Google의 모든 정책 요구사항을 준수하며, 사용자에게 안전하고 편리한 Google Sign In 경험을 제공할 수 있습니다. 🎉
