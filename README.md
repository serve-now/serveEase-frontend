# 🍽️ Serve Now

**주문부터 결제·매출까지, 하나의 흐름으로 관리하는 실시간 POS 시스템**

<img width="800" height="500" alt="랜딩 페이지" src="https://github.com/user-attachments/assets/10a6e1f3-1d39-4ef9-b6df-c19167a196ea" />

<br/><br/>

### 목차

- [1. 프로젝트 개요](#1-프로젝트-개요)
- [2. 시작하기](#2-시작하기)
- [3. 기술 스택](#3-기술-스택)
- [4. 주요 기능](#4-주요-기능)
- [5. 폴더 구조 및 라우팅 설계](#5-폴더-구조-및-라우팅-설계)

<br/>

---

## 1. 프로젝트 개요

### 프로젝트 소개

Serve Now는 **매장의 주문·결제 흐름을 웹으로 구현한 POS 시스템**입니다.

실시간 매장 관리와 운영 편의성을 중심으로 설계되었습니다.  
테이블 상태, 주문 진행, 결제 및 매출 관리 기능을 단계적으로 확장했습니다.

<br/>

### 기간

**2025.09.07 ~ 11.19**

- **1차 MVP**: 09.07 ~ 10.12
- **2차 고도화**: 10.13 ~ 11.19

<br/>

### 팀 구성

- FE 2명
- BE 1명

<br/><br/>

## 2. 시작하기

### [🍽️ Serve Now 바로가기](https://serve-now.site/)

<br/>

### 테스트 계정

| 아이디     | 비밀번호    |
| ---------- | ----------- |
| `test1234` | `test1234*` |

<br/>

### 실행 방법

```bash
# 1. 클론
git clone https://github.com/your-repo/servenow.git

# 2. 패키지 설치
npm install

# 3. 개발 서버 실행
npm run dev
```

<br/><br/>

## 3. 기술 스택

| 구분       | 기술                                 |
| ---------- | ------------------------------------ |
| 프레임워크 | Next.js 15                           |
| 언어       | TypeScript                           |
| 상태 관리  | Tanstack Query, Zustand              |
| UI         | shadcn/ui, TailwindCSS, Lucide Icons |
| 결제       | TossPayments SDK                     |
| 배포       | AWS                                  |
| 기타       | Axios, ESLint, Prettier              |

<br/><br/>

## 4. 주요 기능

<p >
  <img src="https://github.com/user-attachments/assets/20bc9e5c-c9cf-4fec-9305-967f20821d8e"
       width="600"
       alt="테이블 선택 → 메뉴 선택 → 주문 생성 → TossPayments 결제 → 서빙 완료 업데이트 흐름 데모" />
  <br/>
  <sub>주문 생성부터 결제 완료까지의 핵심 사용자 흐름</sub>
</p>

<br/>

### 테이블 관리

- 매장 내 모든 테이블의 상태(빈 테이블 / 주문 중 / 서빙 완료) 실시간 확인
- 실제 매장 구조에 맞게 테이블 개수 설정
- 테이블 클릭 시 주문 내역 모달로 세부 정보 확인

<br/>

### 상품 관리

- 메뉴 생성 및 수정
- 카테고리별 메뉴 분류 관리

<br/>

### 주문 관리

- 메뉴 선택 및 주문 생성
- 카테고리별 메뉴 필터링
- 장바구니 기능으로 여러 메뉴 동시 주문
- 주문 내역 조회 및 서빙 상태 확인

<br/>

### 결제

- TossPayments 연동 카드 결제
- 현금 결제 지원
- 분할 결제 지원 (카드 / 현금)
- 결제 완료 시 테이블 상태 자동 업데이트 (서빙 완료)
- 결제 취소 및 환불 처리 (카드 / 현금)

<br/>

### 매출 및 결제 내역 관리

- 일간 / 주간 / 월간 매출 현황 조회
- 특정 날짜 매출 확인 및 매출 차트 시각화
- 결제 내역 조회 및 필터링 (날짜, 결제 수단 등)
- 금액, 메뉴명 기준 결제 내역 검색

<br/><br/>

## 5. 폴더 구조 및 라우팅 설계

### 전체 폴더 구조

```
├── src/
│ ├── app/
│ │ ├── (private)/pos/
│ │ │ ├── (shell-layout)/
│ │ │ │ ├── payment/          # 결제(카드)
│ │ │ │ ├── payment-history/  # 결제 내역(필터링, 검색, 결제 취소)
│ │ │ │ ├── tables/           # 테이블 / 주문 관리
│ │ │ │ └── products/         # 상품 관리
│ │ │ ├── (full-w-layout)/
│ │ │ │ └── reports/sales/
│ │ │ │    ├── calendar/      # 매출 달력
│ │ │ │    └── chart/         # 매출 차트
│ │ │ └── ...
│ │ └── ...
│ ├── components/             # 재사용 UI 컴포넌트
│ ├── lib/
│ ├── api/                    # API 요청 함수
│ │ ├── queries/              # API 함수 + 쿼리 키 팩토리
│ │ ├── schemas/              # Zod 스키마(런타임 응답 검증)
│ │ └── ...
│ ├── hooks/                  # Tanstack Query 훅, useDebounce 등
│ └── ...
└── public/
```

<br/>

### 주요 디렉토리

| 디렉토리       | 설명                                              |
| -------------- | ------------------------------------------------- |
| `app/`         | Next.js App Router                                |
| `api`          | Axios 요청 함수                                   |
| `hooks/`       | Tanstack Query 쿼리 훅                            |
| `components/`  | 재사용 가능한 UI 컴포넌트 (shadcn/ui 포함)        |
| `lib/`         | Axios 인스턴스, 유틸리티 함수                     |
| `lib/queries/` | Tanstack Query Query Key Factory 등 데이터 레이어 |
| `lib/schemas/` | Zod 기반 런타임 응답 검증 스키마                  |
| `styles/`      | 전역 스타일 및 Tailwind 설정                      |

<br/>

### 라우팅 구조

- **App Router 기반 폴더 라우팅**
  - `app/` 디렉토리 내에서 파일 및 폴더 이름이 자동으로 URL 경로로 매핑
- **Route Group으로 POS 영역 분리**
  - `(private)/pos/` 구조를 통해 `/pos` 내부의 페이지(테이블, 상품, 결제 등) 그룹화
- **공통 레이아웃 분리**
  - `(shell-layout)` 그룹을 사용해 POS 내 공통 헤더, 사이드바 등 레이아웃 구성
- **Intercepting Route & Parallel Routes로 모달 구현**
  - `@modal/(.)orders`, `@modal/(.)new` 등으로 기존 페이지 위에서 모달이 오버레이 구조로 구현
- **동적 라우팅**
  - `[tableId]`, `[productId]` 등 동적 세그먼트를 통해 개별 테이블·상품 상세 페이지 처리
- **리포트(매출) 영역 분리**
  - `(full-w-layout)/reports/sales/*`로 매출 달력/차트 페이지를 POS 기능 영역과 분리

<br/>

---

**✨ 자세한 기술 구현과 트러블슈팅 기록은 [Wiki](https://github.com/serve-now/serveEase-frontend/wiki)에서 확인할 수 있습니다.**

<br/>
