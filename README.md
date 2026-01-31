# 디지털 플래너 플랫폼 (Digital Planner)

개인 맞춤형 디지털 플래너 웹 애플리케이션

## 🎉 프로젝트 개요

- **이름**: Gen Planner
- **목표**: 년/월/주/일 단위를 자유롭게 전환하며 계획을 관리하는 올인원 디지털 플래너
- **현재 단계**: ✅ **Figma 기반 UI 완성! 4개 뷰 모두 작동!**
- **기술 스택**: React 18 + TypeScript + Vite + Tailwind CSS + localStorage
- **배포 URL**: https://gen-planner.pages.dev (Cloudflare Pages)
- **GitHub**: https://github.com/soyongdol-e/Gen_Planner

## ✅ 구현 완료 기능

### 🗓️ 4가지 달력 뷰 시스템

#### 1. **Year View (년 달력)** ✅
- 12개월 미니 달력 그리드
- 이벤트가 있는 날짜 표시 (점 표시)
- 월 클릭으로 Month View 이동
- 이전/다음 년도 네비게이션

#### 2. **Month View (월 달력)** ✅ **[메인 화면]**
- **NavigationBar**: 이전/다음 월 네비게이션
- **MonthlySidebar**: 
  - Monthly Memo (자동 저장)
  - 이벤트 목록 (날짜별 그룹핑)
  - 이전/다음 일정 토글
- **MonthCalendar**: 
  - 7x5 그리드 달력
  - 이벤트 색상 점 표시 (최대 2개)
  - Task 녹색 점 표시 (최대 2개)
  - 남은 일정 개수 표시
  - 호버 시 추가/수정 버튼
- 이벤트 추가/수정/삭제/재정렬
- 주보기/오늘 버튼

#### 3. **Week View (주 달력)** ✅
- **NavigationBar**: 이전/다음 주 네비게이션 (예: 1/26-2/1)
- **WeeklySidebar**:
  - Monthly Memo (읽기 전용)
  - Weekly Checklist (체크박스 항목)
  - Mini Calendar (월 달력)
- **7일 컬럼 레이아웃**:
  - 각 날짜별 이벤트 (All-Day Events)
  - 각 날짜별 Task (Daily Tasks)
  - 인라인 편집 (제목 클릭)
  - 삭제 버튼
- **Weekly Memo** (하단, 자동 저장)

#### 4. **Day View (일 달력)** ✅
- **NavigationBar**: 이전/다음 일 네비게이션
- **DailySidebar**:
  - Mini Calendar (날짜 선택)
  - Monthly Memo (읽기 전용)
  - Weekly Memo (읽기 전용)
  - Weekly Checklist (토글)
  - 월보기/주보기 버튼
- **3컬럼 레이아웃**:
  1. **Task Section** (왼쪽)
     - 24시간별 할일 관리
     - 시간대별 추가 버튼
     - 체크박스 완료 처리
     - 삭제 버튼
  2. **TimeTable Section** (중앙)
     - 24시간 세로 그리드
     - 일정 추가 (시간/색상)
     - 블록 형태로 표시
     - 인라인 편집/삭제
  3. **Event + Comment** (오른쪽 2단)
     - **Event Section** (상단)
       - All-Day Events
       - 드래그 재정렬
       - 삭제 버튼
     - **Comment Section** (하단)
       - 텍스트/이미지 요소
       - 드래그/리사이즈
       - 색상/폰트 설정

### 💾 데이터 저장 방식
- **localStorage 기반** 로컬 저장
- 별도 서버/데이터베이스 불필요
- 브라우저 내 영구 저장
- 샘플 데이터 자동 초기화

### 📝 자동 저장 시스템
- **Monthly Memo**: 500ms 디바운스 자동 저장
- **Weekly Memo**: 500ms 디바운스 자동 저장
- **Daily Comment**: 500ms 디바운스 자동 저장

## 🚀 실행 방법

### 1. 저장소 클론
```bash
git clone https://github.com/soyongdol-e/Gen_Planner.git
cd Gen_Planner
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

### 4. 빌드
```bash
npm run build
```

### 5. 배포 (Cloudflare Pages)
```bash
npm run deploy
```

## 📊 데이터 구조

### LocalStorage Keys
- `planner_events` - 이벤트 (Event + TimeTable)
- `planner_monthly_memos` - 월별 메모
- `planner_weekly_memos` - 주별 메모
- `planner_weekly_checklists` - 주별 체크리스트
- `planner_daily_tasks` - 일별 할일
- `planner_daily_comments` - 일별 코멘트

### 주요 타입
```typescript
// Event (이벤트/일정)
{
  id: string;
  title: string;
  date: string;           // YYYY-MM-DD
  startTime?: string;     // HH:mm AM/PM
  endTime?: string;       // HH:mm AM/PM
  color: string;
  isAllDay?: boolean;
  isTimeTable?: boolean;
  order?: number;
}

// MonthlyMemo (월별 메모)
{
  year: number;
  month: number;          // 1-12
  content: string;
}

// WeeklyMemo (주별 메모)
{
  weekStart: string;      // YYYY-MM-DD
  content: string;
}

// WeeklyChecklistItem (주별 체크리스트)
{
  id: string;
  weekStart: string;
  content: string;
  completed: boolean;
  order: number;
}

// DailyTask (일별 할일)
{
  id: string;
  date: string;
  content: string;
  completed: boolean;
  order: number;
  hour?: number;          // 0-23
}

// DailyComment (일별 코멘트)
{
  date: string;
  elements: CommentElement[];
}
```

## 🎯 사용 가이드

### 앱 시작
1. 앱 첫 실행 시 샘플 데이터 자동 로드
2. **Month View**가 기본 화면
3. 상단 네비게이션으로 뷰 전환

### Month View 사용법
1. **년도 클릭** → Year View 이동
2. **날짜 클릭** → Day View 이동
3. **주보기 버튼** → Week View 이동
4. **날짜 호버** → 이벤트 추가/수정 버튼
5. **좌측 사이드바**:
   - Monthly Memo 작성
   - 이벤트 목록 확인

### Week View 사용법
1. **날짜 헤더 클릭** → Day View 이동
2. **날짜 영역 클릭** → Day View 이동 (배경)
3. **이벤트 클릭** → 인라인 편집
4. **Task 클릭** → 체크박스 토글
5. **하단** → Weekly Memo 작성

### Day View 사용법
1. **Task Section**: 시간대별 할일 추가/완료
2. **TimeTable Section**: 마우스로 일정 추가
3. **Event Section**: All-Day Event 관리
4. **Comment Section**: 텍스트/이미지 추가

### Year View 사용법
1. **월 클릭** → Month View 이동
2. **이전/다음 년도** 네비게이션
3. 이벤트가 있는 날짜에 점 표시

## 🛠️ 기술 스택

### Frontend
- **React 18.3.1** - UI 라이브러리
- **TypeScript 5.x** - 타입 안전성
- **Vite 6.x** - 빠른 빌드 도구
- **Tailwind CSS 4.x** - 유틸리티 CSS
- **Lucide React** - 아이콘

### 날짜 처리
- **date-fns 3.6.0** - 날짜 유틸리티

### 배포
- **Cloudflare Pages** - 엣지 배포 플랫폼
- **Wrangler** - Cloudflare CLI

### 상태 관리
- **React Hooks** - useState, useEffect
- **localStorage** - 브라우저 로컬 저장소

## 📁 프로젝트 구조

```
webapp/
├── src/
│   ├── components/
│   │   ├── views/              # 4가지 뷰
│   │   │   ├── YearView.tsx
│   │   │   ├── MonthView.tsx
│   │   │   ├── WeekView.tsx
│   │   │   └── DayView.tsx
│   │   ├── NavigationBar.tsx   # 상단 네비게이션
│   │   ├── MonthlySidebar.tsx  # 월 사이드바
│   │   ├── MonthCalendar.tsx   # 월 달력 그리드
│   │   ├── WeeklySidebar.tsx   # 주 사이드바
│   │   ├── DailySidebar.tsx    # 일 사이드바
│   │   ├── TaskSection.tsx     # 할일 섹션
│   │   ├── TimeTableSection.tsx # 타임테이블
│   │   ├── EventSection.tsx    # 이벤트 섹션
│   │   ├── CommentSection.tsx  # 코멘트 섹션
│   │   ├── AddEventDialog.tsx  # 이벤트 추가
│   │   ├── EditEventsDialog.tsx # 이벤트 편집
│   │   └── ui/                 # UI 컴포넌트
│   │       ├── button.tsx
│   │       ├── textarea.tsx
│   │       └── utils.ts
│   ├── types/
│   │   └── index.ts            # TypeScript 타입
│   ├── utils/
│   │   ├── dateUtils.ts        # 날짜 유틸리티
│   │   ├── storage.ts          # localStorage API
│   │   └── sampleData.ts       # 샘플 데이터
│   ├── App.tsx                 # 메인 앱
│   ├── main.tsx
│   └── index.css
├── public/                      # 정적 파일
├── package.json
├── vite.config.ts
├── wrangler.jsonc               # Cloudflare 설정
├── ecosystem.config.cjs         # PM2 설정
└── README.md
```

## 📈 개발 진행 상황

### ✅ Phase 1: 완료 (Year/Month/Week/Day Views)
- [x] Year View - 12개월 그리드
- [x] Month View - Figma 디자인 완전 구현
- [x] Week View - 7일 컬럼 + 사이드바
- [x] Day View - 3컬럼 레이아웃
- [x] NavigationBar 컴포넌트
- [x] Sidebar 컴포넌트들 (Monthly/Weekly/Daily)
- [x] Task/TimeTable/Event/Comment 섹션
- [x] localStorage 데이터 저장
- [x] 샘플 데이터 초기화
- [x] GitHub 연동
- [x] Cloudflare Pages 배포

### 🔮 향후 확장 가능
- [ ] 반복 일정 (recurring events)
- [ ] 공휴일 API 연동
- [ ] 데이터 내보내기/가져오기
- [ ] 다크 모드
- [ ] 다국어 지원
- [ ] 모바일 최적화
- [ ] PWA (Progressive Web App)
- [ ] 클라우드 동기화 (Supabase)

## 🎨 주요 특징

### 직관적인 UI/UX
- Figma 디자인 기반 깔끔한 인터페이스
- Tailwind CSS로 일관된 디자인 시스템
- 호버 효과 및 시각적 피드백
- 반응형 레이아웃

### 빠른 로컬 저장
- localStorage 기반 즉시 저장
- 별도 서버 불필요
- 오프라인 작동 가능
- 자동 저장 (디바운스)

### 유연한 데이터 모델
- Event와 TimeTable 통합
- 색상 시스템으로 시각적 구분
- 날짜별 독립적인 데이터
- 확장 가능한 구조

## 🔗 배포 정보

- **Production URL**: https://gen-planner.pages.dev
- **Branch URL**: https://main.gen-planner.pages.dev
- **GitHub Repository**: https://github.com/soyongdol-e/Gen_Planner
- **Cloudflare Project**: gen-planner

### 배포 명령어
```bash
# 빌드
npm run build

# 배포
npm run deploy

# 또는 직접 배포
npx wrangler pages deploy dist --project-name gen-planner
```

## 📝 개발 상태

- **최종 업데이트**: 2026-01-31
- **버전**: v1.0.0 (Figma Integration Complete)
- **상태**: ✅ **4개 뷰 모두 작동! 배포 완료!**
- **다음 단계**: 사용자 테스트 및 피드백 수집

## 📦 프로젝트 백업

백업 다운로드: https://www.genspark.ai/api/files/s/YUhQesUY

## 📄 라이선스

MIT

---

**Made with ❤️ using React + TypeScript + localStorage + Cloudflare Pages**
