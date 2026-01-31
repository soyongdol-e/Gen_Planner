# 디지털 플래너 플랫폼 (Digital Planner)

개인 맞춤형 디지털 플래너 웹 애플리케이션

## 프로젝트 개요

- **목표**: 년/월/주/일 단위를 자유롭게 전환하며 계획을 관리하는 올인원 디지털 플래너
- **현재 단계**: 프로토타입 개발 중
- **기술 스택**: React 18 + TypeScript + Vite + Tailwind CSS + Supabase

## 주요 기능

### 구현 완료
- ✅ 프로젝트 초기 설정
- ✅ Supabase 연동
- ✅ TypeScript 타입 정의
- ✅ 데이터베이스 스키마

### 구현 예정
- ⏳ 4가지 달력 뷰 (Year/Month/Week/Day)
- ⏳ Event 관리 (일정 추가/수정/삭제)
- ⏳ TimeTable 그리드 시스템 (드래그로 시간 블록 생성)
- ⏳ Task 체크리스트
- ⏳ 메모 시스템 (Monthly/Weekly/Daily)
- ⏳ 반복 일정
- ⏳ Comment 에디터

## 설치 및 실행

### 1. 의존성 설치
\`\`\`bash
npm install
\`\`\`

### 2. Supabase 데이터베이스 설정
1. Supabase 대시보드 접속: https://app.supabase.com
2. 프로젝트 선택
3. SQL Editor에서 `supabase-schema.sql` 파일 내용 실행

### 3. 환경 변수 설정
`.env` 파일이 이미 생성되어 있습니다.

### 4. 개발 서버 실행
\`\`\`bash
npm run dev
\`\`\`

브라우저에서 http://localhost:5173 접속

## 데이터 구조

### 데이터베이스 테이블
1. **events** - 일정 관리
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

## 개발 로드맵

### Phase 1: 기본 구조 (현재)
- [x] 프로젝트 설정
- [ ] Month View 구현
- [ ] Day View 구현

### Phase 2: TimeTable 시스템
- [ ] 시간 그리드 생성
- [ ] 드래그 블록 생성
- [ ] 블록 이동/크기 조정

### Phase 3: Event & Task
- [ ] Event CRUD
- [ ] Task 체크리스트
- [ ] 색상 시스템

### Phase 4: 메모 시스템
- [ ] Monthly Memo
- [ ] Weekly Memo
- [ ] Daily Comment (텍스트)

### Phase 5: 확장 기능
- [ ] Week View
- [ ] Year View
- [ ] 반복 일정

## 기술 스택

- **Frontend**: React 18.3.1 + TypeScript
- **Build Tool**: Vite 6.x
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **날짜 처리**: date-fns
- **드래그 앤 드롭**: react-dnd

## 프로젝트 구조

\`\`\`
webapp/
├── src/
│   ├── lib/
│   │   └── supabase.ts      # Supabase 클라이언트
│   ├── types/
│   │   └── index.ts         # TypeScript 타입 정의
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── supabase-schema.sql      # 데이터베이스 스키마
├── .env                     # 환경 변수 (Supabase 키)
└── package.json
\`\`\`

## 개발 상태

- **최종 업데이트**: 2026-01-31
- **현재 단계**: Phase 1 - 프로젝트 초기 설정 완료
- **다음 단계**: Month View 레이아웃 구현

## 라이선스

MIT
