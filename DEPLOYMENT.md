# 배포 가이드

## GitHub에 업로드하기

### 1. GitHub 저장소 생성
1. GitHub에서 새 저장소 생성: https://github.com/new
2. 저장소 이름: `Gen_Planner` (또는 원하는 이름)
3. Public/Private 선택
4. **Initialize with README 체크 해제** (이미 README가 있으므로)

### 2. 로컬에서 GitHub에 푸시
```bash
cd /home/user/webapp

# 원격 저장소 추가
git remote add origin https://github.com/soyongdol-e/Gen_Planner.git

# main 브랜치로 푸시
git push -u origin main
```

### 3. GitHub Personal Access Token 필요 시
만약 비밀번호 입력이 요구되면:
1. GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. `repo` 권한 선택
4. 생성된 토큰을 비밀번호 대신 사용

---

## Vercel로 배포하기 (추천)

### 1. Vercel 계정 생성
- https://vercel.com 접속
- GitHub 계정으로 로그인

### 2. 프로젝트 Import
1. Vercel 대시보드에서 "Add New" → "Project"
2. GitHub 저장소 연결
3. `Gen_Planner` 저장소 선택
4. "Import" 클릭

### 3. 환경 변수 설정
**Environment Variables** 섹션에서 추가:
```
VITE_SUPABASE_URL = https://zdjodtyljgakvpvlnxws.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpkam9kdHlsamdha3ZwdmxueHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4Mzg4NjAsImV4cCI6MjA4NTQxNDg2MH0.a4xYU2IEGDvQFpuGEU-XzmRUBoAQmtA3SZI7bYfcdkM
```

### 4. 배포 설정
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 5. Deploy 클릭
- 자동으로 빌드 및 배포
- 몇 분 후 배포 URL 생성 (예: `https://gen-planner.vercel.app`)

---

## Netlify로 배포하기 (대안)

### 1. Netlify 계정 생성
- https://netlify.com 접속
- GitHub 계정으로 로그인

### 2. New Site from Git
1. "Add new site" → "Import an existing project"
2. GitHub 연결
3. `Gen_Planner` 저장소 선택

### 3. 빌드 설정
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### 4. 환경 변수 설정
Site settings → Environment variables에서 추가:
```
VITE_SUPABASE_URL = https://zdjodtyljgakvpvlnxws.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpkam9kdHlsamdha3ZwdmxueHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4Mzg4NjAsImV4cCI6MjA4NTQxNDg2MH0.a4xYU2IEGDvQFpuGEU-XzmRUBoAQmtA3SZI7bYfcdkM
```

### 5. Deploy
- 자동 배포 시작
- 배포 URL 생성 (예: `https://gen-planner.netlify.app`)

---

## 주의사항

### ⚠️ 환경 변수
- `.env` 파일은 GitHub에 업로드되지 않음 (`.gitignore`에 포함)
- 배포 플랫폼에서 환경 변수를 직접 설정해야 함
- Supabase URL과 Anon Key는 공개되어도 괜찮음 (RLS 정책으로 보호)

### 🔄 자동 배포
- GitHub에 push하면 Vercel/Netlify가 자동으로 재배포
- main 브랜치에 commit → 자동 배포

### 📝 배포 후 확인사항
1. 배포 URL 접속하여 앱 작동 확인
2. Supabase 연동 확인 (데이터 CRUD 테스트)
3. 모든 기능 정상 작동 확인

---

## 트러블슈팅

### 빌드 실패 시
- 에러 로그 확인
- `npm run build` 로컬에서 테스트
- 의존성 문제 확인

### 환경 변수 문제
- `VITE_` 접두사 확인
- Vercel/Netlify에서 환경 변수 재확인
- 재배포 시도

### Supabase 연결 오류
- Supabase URL과 Key 확인
- Supabase 프로젝트가 활성 상태인지 확인
- 네트워크 탭에서 API 요청 확인
