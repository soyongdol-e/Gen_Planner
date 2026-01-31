# 디지털 플래너 플랫폼 (Digital Planner)

개인 맞춤형 디지털 플래너 웹 애플리케이션 - 프로토타입

## 🎉 프로젝트 개요

- **목표**: 년/월/주/일 단위를 자유롭게 전환하며 계획을 관리하는 올인원 디지털 플래너
- **현재 단계**: ✅ **핵심 프로토타입 완성!**
- **기술 스택**: React 18 + TypeScript + Vite + Tailwind CSS + Supabase
- **배포 URL**: https://5173-iiwvopu7to0ll3x1x19hv-2e1b9533.sandbox.novita.ai

## ✅ 구현 완료 기능

### 🗓️ 달력 뷰 시스템
- **Month View (월 달력)** - 기본 화면, 월간 일정 조망
- **Day View (일 달력)** - 4구역 레이아웃으로 상세 관리
- **Year View (년 달력)** - 12개월 조망 (기본 틀)
- **Week View (주 달력)** - 주간 스케줄 (기본 틀)

### ✅ Task 시스템 (할일 관리)
- Task 추가/완료/삭제
- 체크박스로 완료 상태 토글
- 인라인 편집 기능
- 날짜별 자동 로드

### 📅 Event 시스템 (일정 관리)
- All-Day Event 추가/수정/삭제
- 10가지 색상 팔레트
- Month View에 색상 점으로 표시
- Day View에 리스트로 표시

### ⏰ TimeTable 그리드 (핵심!)
- 24시간 세로 그리드 (0시~23시)
- 10분 단위 셀 (144개)
- 마우스 드래그로 시간 블록 생성
- 블록 클릭하여 수정/삭제
- 색상 지정 및 시간 범위 설정
- AM/PM 형식 시간 표시

### 📝 메모 시스템
- **Monthly Memo** - 월별 메모 (자동 저장)
- 토글로 접기/펼치기 가능
- 500ms 디바운스 자동 저장

### 🔐 인증 시스템
- 더미 인증 (demo-user)
- Supabase RLS (Row Level Security)
- 프로토타입용 간소화 인증

## 🚀 실행 방법

### 1. 의존성 설치
```bash
npm install
```

### 2. Supabase 데이터베이스 설정
1. Supabase 대시보드 접속: https://app.supabase.com
2. 프로젝트 선택
3. SQL Editor에서 `supabase-schema.sql` 파일 내용 실행

### 3. 환경 변수 설정
`.env` 파일이 이미 생성되어 있습니다.

### 4. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 http://localhost:5173 접속

## 📊 데이터 구조

### 데이터베이스 테이블 (8개)
1. **events** - 일정 관리 (Event + TimeTable)
2. **monthly_memos** - 월별 메모
3. **weekly_memos** - 주별 메모
4. **weekly_checklist_items** - 주별 체크리스트
5. **daily_tasks** - 일별 할일
6. **daily_comments** - 일별 코멘트
7. **user_settings** - 사용자 설정
8. **holidays_cache** - 공휴일 캐시

### 데모 사용자
- User ID: `00000000-0000-0000-0000-000000000000`
- 프로토타입 단계에서는 로그인 없이 데모 사용자로 작동

## 🎯 사용 가이드

### Month View (월 달력)
1. 앱 시작 시 기본 화면
2. 날짜 클릭 → Day View로 이동
3. 년도 클릭 → Year View로 이동
4. 좌측 사이드바에서 Monthly Memo 작성
5. 일정 목록에서 전체 Event 조망

### Day View (일 달력)
1. **Sidebar**: 월 버튼 클릭하여 Month View로 복귀
2. **Task Section**: 할일 추가/완료/삭제
3. **TimeTable Section**: 
   - 마우스로 드래그하여 시간 범위 선택
   - 모달에서 제목, 색상 입력
   - 생성된 블록 클릭하여 수정/삭제
4. **Event Section**: All-Day Event 관리
5. **Comment Section**: (프로토타입에서는 미구현)

### Year View (년 달력)
1. Month View에서 년도 클릭
2. 12개월 그리드 조망
3. 월 클릭 → Month View로 이동

## 🛠️ 기술 스택

- **Frontend**: React 18.3.1 + TypeScript 5.x
- **Build Tool**: Vite 6.x
- **Styling**: Tailwind CSS 4.x
- **Database**: Supabase (PostgreSQL)
- **날짜 처리**: date-fns 3.6.0
- **상태 관리**: React Hooks (Context API)
- **드래그 앤 드롭**: react-dnd 16.0.1

## 📁 프로젝트 구조

```
webapp/
├── src/
│   ├── components/
│   │   ├── common/          # 재사용 컴포넌트
│   │   │   ├── TaskItem.tsx
│   │   │   ├── EventItem.tsx
│   │   │   ├── EventModal.tsx
│   │   │   ├── TimeTableGrid.tsx
│   │   │   └── TimeBlockModal.tsx
│   │   └── views/           # 뷰 컴포넌트
│   │       ├── MonthView.tsx
│   │       ├── DayView.tsx
│   │       ├── YearView.tsx
│   │       └── WeekView.tsx
│   ├── contexts/
│   │   └── AppContext.tsx   # 전역 상태 관리
│   ├── hooks/
│   │   └── useAutoSave.ts   # 자동 저장 Hook
│   ├── lib/
│   │   ├── supabase.ts      # Supabase 클라이언트
│   │   └── auth.ts          # 인증 로직
│   ├── types/
│   │   └── index.ts         # TypeScript 타입 정의
│   ├── utils/
│   │   ├── dateUtils.ts     # 날짜 유틸리티
│   │   ├── taskApi.ts       # Task API
│   │   ├── eventApi.ts      # Event API
│   │   ├── memoApi.ts       # Memo API
│   │   ├── timeTableUtils.ts # TimeTable 유틸리티
│   │   └── constants.ts     # 상수 정의
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── supabase-schema.sql      # 데이터베이스 스키마
├── .env                     # 환경 변수
├── package.json
├── vite.config.ts
└── README.md
```

## 📈 개발 진행 상황

### ✅ Phase 1-6: 완료 (10/10)
- [x] 프로젝트 초기 설정
- [x] Supabase 연동
- [x] 데이터베이스 스키마
- [x] 더미 인증 시스템
- [x] Month View 구현
- [x] Day View 구현
- [x] Task 시스템
- [x] Event CRUD
- [x] TimeTable 그리드
- [x] Monthly Memo

### 🔮 향후 확장 (선택)
- [ ] Week View 완성
- [ ] Weekly Checklist 구현
- [ ] Weekly Memo 구현
- [ ] 반복 일정 생성
- [ ] 공휴일 API 연동
- [ ] Comment Canvas (이미지+텍스트)
- [ ] 실제 OAuth 로그인
- [ ] 알림/리마인더
- [ ] 검색 기능
- [ ] 데이터 내보내기

## 🎨 주요 특징

### 직관적인 UI/UX
- 깔끔한 Tailwind CSS 디자인
- 모달 기반 편집 인터페이스
- 호버 효과 및 시각적 피드백

### 실시간 데이터 동기화
- Supabase를 통한 즉시 저장
- 날짜 변경 시 자동 로드
- 자동 저장 (500ms 디바운스)

### 유연한 데이터 모델
- Event와 TimeTable 통합 관리
- 색상 시스템으로 시각적 구분
- 날짜별 독립적인 데이터 관리

## 📝 개발 상태

- **최종 업데이트**: 2026-01-31
- **현재 단계**: ✅ **핵심 프로토타입 완성**
- **다음 단계**: 사용자 테스트 및 피드백 수집

## 📄 라이선스

MIT

---

**Made with ❤️ using React + TypeScript + Supabase**
