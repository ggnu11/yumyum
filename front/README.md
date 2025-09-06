## 깃허브 주소

- [바로가기](https://github.com/InKyoJeong/Matzip/blob/class/3-6/matzip/src/components/InputField.tsx)

## kakao 연동 시, 리다이렉트 에러

- [바로가기](https://developers.kakao.com/console/app/1299967/product/login) 에서 리다이렉트 URI 등록
  예) `http://localhost:3030/auth/oauth/kakao`

## 프로젝트 생성

1. `npx @react-native-community/cli@18.0.0 init matzip --version 0.79.4` 명령어로 프로젝트 생성

2. 다음 명령어로 ios 설정

```bash
cd matzip

cd ios

bundle install

bundle exec pod install
```

## React Navigation 설치

1. 다음 명령어로 `React Native` 설치

```
npm install @react-navigation/native

npm install react-native-screens react-native-safe-area-context

npx pod-install ios
```

2. `android -> app -> src -> main -> java/com/matzip`파일 경로 이동 후 `MainActivity.kt`에 다음 코드 추가

```

import android.os.Bundle;

...

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)
  }

...

```

3. `stack` 설치를 위해 다음 명령어 입력

```
npm install @react-navigation/stack

npm install react-native-gesture-handler

npm install @react-native-masked-view/masked-view

npx pod-install ios
```

4. `drawer` 설치를 위해 하단의 명령어 실행

```
npm install @react-navigation/drawer

npm install react-native-gesture-handler react-native-reanimated

npm install react-native-reanimated

npm install react-native-worklets

npx expo prebuild
```

5, `babel.config.js` 에 다음 코드 추가

```
  module.exports = {
    presets: [
      ... // don't add it here :)
    ],
    plugins: [
      ...
      'react-native-worklets/plugin',
    ],
  };
```

6. `npm start -- --reset-cache` 입력하여 캐시 초기화

7. `cd ios && pod install && cd ..` 명령어로 `ios` 에 `pod` 설치

8. `npx pod-install ios` 명령어로 `pod` 설치

## 아이콘 적용하기

1. [아이콘 사이트](https://github.com/oblador/react-native-vector-icons?tab=readme-ov-file) 의 `Available Icon Sets - Actively maintained` 에서 사용할 아이콘을 선택한다.
2. 다음 명령어로 아이콘을 설치한다.

```

// fontawesome6 + Icon

npm install @react-native-vector-icons/fontawesome6 @react-native-vector-icons/ionicons
```

3. Setup - 다음 명령어로 ios를 설정한다(AppName에는 프로젝트명으로 수정)

```
// 기본
npx rnvi-update-plist package.json ios/AppName/Info.plist

// matzip
npx rnvi-update-plist package.json ios/matzip/Info.plist
```

## 절대 경로 설정

1. 다음 명령어로 절대경로 설정

```
npm i -D babel-plugin-module-resolver
```

## EncryptStorage 설치

1. 다음 명령어로 `EncryptStorage` 설치

```
npm install react-native-encrypted-storage

npx pod-install
```

## 백엔드

1. server 파일 다운

2. `npm i`로 의존성 설치
3. `.env`에 코드 추가

- DB_USERNAME : 터미널에 `whoami` 입력 후 결과값 추가

4. 다음 명령어로 `postgresql14` 설치

```
brew install postgresql@14
```

5. `postgresql` 실행 명령어

```
// 실행
brew services start postgresql@14

// 중지
brew services stop postgresql@14
```

6. `pgAdmin` 설치

- [pgAdmin](https://www.postgresql.org/ftp/pgadmin/pgadmin4/v9.5/macos/) 클릭
- `pgadmin4-9.5-arm64.dmg` 설치

7. `matzip-app` 명의 서버 생성

- 주의 : `brew services start postgresql@14`로 실행 후 서버를 생성해야함(미실행 시, 에러 발생)

8. `npm run start:dev`로 서버 실행

## API 추가

1. `npm i axios` 로 `axios` 설치

2. `ifconfig | grep inet`

## Tanstack 설치

1. `npm i @tanstack/react-query` 명령어로 Tanstack 설치

## `react-native-image-crop-picker` 설치

1. `npm i react-native-image-crop-picker --save` 명령어로 설치

## react-error-boundary

1.`npm install react-error-boundary` 명령어로 설치.
