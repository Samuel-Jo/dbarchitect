import { MatchingPair, PersistenceItem, PersistenceEssay, TableScenario, TechScenario } from '../types';

// --- Stage 1: Persistence (RAM vs DISK) ---
export const PERSISTENCE_POOL: PersistenceItem[] = [
  // Level 1: Everyday Analogies
  { id: 101, difficulty: 1, text: "게임 캐릭터의 현재 체력(HP)", type: 'RAM', explanation: "실시간으로 빠르게 변하는 전투 상태값은 RAM이 적합합니다." },
  { id: 102, difficulty: 1, text: "내 컴퓨터의 '바탕화면' 저장 파일", type: 'DISK', explanation: "컴퓨터를 꺼도 사라지면 안 되므로 DISK에 저장합니다." },
  { id: 103, difficulty: 1, text: "계산기 앱에 입력 중인 숫자", type: 'RAM', explanation: "연산 중인 임시 값은 RAM을 사용합니다." },
  { id: 104, difficulty: 1, text: "스마트폰 갤러리의 가족 사진", type: 'DISK', explanation: "영구적으로 보관해야 하므로 DISK(Flash)에 저장합니다." },
  { id: 105, difficulty: 1, text: "유튜브 동영상 '일시정지' 위치", type: 'RAM', explanation: "앱을 끄면 보통 사라지거나, 서버에서 다시 불러와야 하는 임시 데이터입니다." },
  { id: 106, difficulty: 1, text: "한글(Word) 문서의 '저장하기' 버튼", type: 'DISK', explanation: "저장 버튼은 RAM의 내용을 DISK로 옮기는 작업입니다." },
  
  // Level 2: Web & Basic Computing
  { id: 201, difficulty: 2, text: "웹 브라우저의 '새로고침' 전 입력 폼 내용", type: 'RAM', explanation: "새로고침 시 날아가는 데이터는 RAM에 있었기 때문입니다." },
  { id: 202, difficulty: 2, text: "회원가입 완료된 사용자 ID/PW", type: 'DISK', explanation: "사용자 계정 정보는 DB(DISK)에 영구 저장해야 합니다." },
  { id: 203, difficulty: 2, text: "로그인 유지용 세션 ID (Session)", type: 'RAM', explanation: "서버 메모리(RAM)에 저장하여 빠르게 인증 상태를 확인합니다." },
  { id: 204, difficulty: 2, text: "쇼핑몰의 '주문 완료' 내역", type: 'DISK', explanation: "결제 및 배송 근거 자료이므로 절대 지워지면 안 됩니다." },
  { id: 205, difficulty: 2, text: "Ctrl+C 복사한 클립보드 데이터", type: 'RAM', explanation: "휘발성 메모리 영역인 클립보드를 사용합니다." },
  { id: 206, difficulty: 2, text: "카카오톡 대화 내용 백업 파일", type: 'DISK', explanation: "백업 데이터는 파일 형태로 저장소에 보관됩니다." },

  // Level 3: Technical Architecture
  { id: 301, difficulty: 3, text: "Redis 캐시 데이터", type: 'RAM', explanation: "Redis는 대표적인 In-Memory(RAM) 데이터 저장소입니다." },
  { id: 302, difficulty: 3, text: "DBMS의 트랜잭션 로그 (WAL)", type: 'DISK', explanation: "장애 복구를 위해 로그는 반드시 디스크에 기록되어야 합니다." },
  { id: 303, difficulty: 3, text: "운영체제 Swap 메모리", type: 'DISK', explanation: "RAM이 부족할 때 디스크의 일부를 빌려 쓰는 기술입니다. (예외적 케이스)" },
  { id: 304, difficulty: 3, text: "Docker 컨테이너의 내부 상태", type: 'RAM', explanation: "컨테이너 재시작 시 초기화되는 데이터는 휘발성입니다." },
  { id: 305, difficulty: 3, text: "데이터베이스 버퍼 풀 (Buffer Pool)", type: 'RAM', explanation: "자주 쓰는 데이터를 디스크에서 퍼올려 RAM에 둔 영역입니다." },
  { id: 306, difficulty: 3, text: "S3 객체 스토리지 파일", type: 'DISK', explanation: "클라우드 환경의 대표적인 영구 파일 저장소입니다." },

  // Level 4: Enterprise & Deep Tech
  { id: 401, difficulty: 4, text: "Kafka 메시지 큐 (Retention 기간 내)", type: 'DISK', explanation: "Kafka는 메시지를 디스크에 순차적으로 기록하여 내구성을 보장합니다." },
  { id: 402, difficulty: 4, text: "Spark RDD (Resilient Distributed Datasets)", type: 'RAM', explanation: "Spark는 메모리 기반 처리로 고속 분석을 수행합니다." },
  { id: 403, difficulty: 4, text: "Memcached 저장 값", type: 'RAM', explanation: "단순 캐싱을 위한 휘발성 키-값 저장소입니다." },
  { id: 404, difficulty: 4, text: "Git Commit History (.git 폴더)", type: 'DISK', explanation: "버전 관리 이력은 로컬 디스크 및 원격 저장소에 영구 보존됩니다." },
  { id: 405, difficulty: 4, text: "리눅스 /tmp 디렉토리 (Reboot 시)", type: 'RAM', explanation: "보통 재부팅 시 삭제되도록 설정되거나 tmpfs(RAM)를 사용합니다." },
  { id: 406, difficulty: 4, text: "블록체인 원장 데이터 (Ledger)", type: 'DISK', explanation: "모든 노드에 영구적으로 기록되고 분산 저장되어야 합니다." }
];

export const PERSISTENCE_ESSAYS: PersistenceEssay[] = [
  // Level 1
  {
    id: 'pe-1-1', difficulty: 1,
    question: "컴퓨터 전원을 끄면 RAM에 있던 데이터는 사라집니다. 그 이유는 무엇인가요?",
    context: "RAM is volatile memory requiring power to maintain state.",
    modelAnswer: "RAM은 전원이 공급되어야만 데이터를 유지할 수 있는 휘발성 메모리이기 때문입니다."
  },
  {
    id: 'pe-1-2', difficulty: 1,
    question: "중요한 문서를 작성할 때 '저장(Save)' 버튼을 누르는 것은 컴퓨터 내부에서 어떤 동작을 의미하나요?",
    context: "Moving data from volatile RAM to non-volatile Disk storage.",
    modelAnswer: "휘발성 메모리인 RAM에 있는 작업 내용을 비휘발성 저장소인 하드디스크(DISK)로 복사하여 영구 보존하는 동작입니다."
  },

  // Level 2
  {
    id: 'pe-2-1', difficulty: 2,
    question: "로그인 정보를 DB가 아닌 Redis 같은 메모리 저장소(RAM)에 저장하는 주된 이유는 무엇인가요?",
    context: "Speed of access for frequent authentication checks.",
    modelAnswer: "로그인 확인은 매우 빈번하게 일어나므로, 디스크보다 접근 속도가 훨씬 빠른 RAM을 사용하여 응답 속도를 높이기 위함입니다."
  },
  {
    id: 'pe-2-2', difficulty: 2,
    question: "쇼핑몰의 '장바구니' 기능은 로그인 전에도 유지되곤 합니다. 이를 서버 메모리(Session)에 저장할 때의 장단점은?",
    context: "Fast access but consumes server RAM resources; risk of loss on server restart.",
    modelAnswer: "장점은 빠른 읽기/쓰기가 가능하다는 것이고, 단점은 사용자가 많을수록 서버 메모리를 많이 차지하며 서버 재시작 시 정보가 날아갈 수 있다는 점입니다."
  },

  // Level 3
  {
    id: 'pe-3-1', difficulty: 3,
    question: "데이터베이스는 디스크에 저장되지만, 성능을 위해 '버퍼 풀(Buffer Pool)'이라는 메모리 영역을 둡니다. 이 영역의 역할은?",
    context: "Caching frequently accessed disk pages in RAM to reduce I/O.",
    modelAnswer: "자주 사용하는 데이터 페이지를 디스크에서 읽어 메모리(Buffer Pool)에 캐싱해 둠으로써, 느린 디스크 I/O를 최소화하고 처리 속도를 높이는 역할입니다."
  },
  {
    id: 'pe-3-2', difficulty: 3,
    question: "Redis 같은 인메모리 DB도 데이터를 디스크에 저장하는 옵션(RDB, AOF)을 제공합니다. 메모리 DB인데 왜 디스크 저장이 필요할까요?",
    context: "Persistence and recovery in case of power failure or crash.",
    modelAnswer: "메모리는 휘발성이므로, 서버 장애나 전원 차단 시 데이터가 모두 유실되는 것을 방지하고 재시작 시 복구하기 위해 디스크에 백업이 필요합니다."
  },

  // Level 4
  {
    id: 'pe-4-1', difficulty: 4,
    question: "데이터베이스의 트랜잭션 로그(WAL)는 성능을 위해 메모리 버퍼를 거치지만, 결국 디스크에 동기화(fsync)해야 합니다. 이 주기는 어떤 트레이드오프가 있나요?",
    context: "Durability vs Performance (Latency).",
    modelAnswer: "디스크 동기화를 자주 하면 데이터 유실 위험(Durability)은 줄어들지만 쓰기 성능(Performance)이 저하되고, 가끔 하면 성능은 좋지만 장애 시 데이터 유실 가능성이 커집니다."
  },
  {
    id: 'pe-4-2', difficulty: 4,
    question: "Kafka는 메시지를 디스크에 저장하지만 매우 빠릅니다. 디스크를 사용함에도 속도가 빠른 아키텍처적 이유는 무엇인가요?",
    context: "Sequential I/O and Zero-copy principle.",
    modelAnswer: "디스크의 랜덤 액세스 대신 순차 쓰기(Sequential I/O)를 사용하여 속도를 높이고, OS의 페이지 캐시와 Zero-copy 기술을 적극 활용하기 때문입니다."
  }
];

// --- Stage 2: Terminology (Excel vs DB) ---
export const TERMINOLOGY_POOL: MatchingPair[] = [
  // Level 1: Basic Structure
  { id: 't1-1', difficulty: 1, left: '시트 (Sheet)', right: '테이블 (Table)' },
  { id: 't1-2', difficulty: 1, left: '행 (Row)', right: '레코드 (Record)' },
  { id: 't1-3', difficulty: 1, left: '열 (Column)', right: '필드 (Field)' },
  { id: 't1-4', difficulty: 1, left: '엑셀 파일 (.xlsx)', right: '데이터베이스 (DB)' },
  
  // Level 2: Operations
  { id: 't2-1', difficulty: 2, left: 'VLOOKUP 함수', right: '조인 (JOIN)' },
  { id: 't2-2', difficulty: 2, left: '필터 (Filter)', right: 'WHERE 조건절' },
  { id: 't2-3', difficulty: 2, left: '중복 제거', right: 'DISTINCT' },
  { id: 't2-4', difficulty: 2, left: '정렬 (Sort)', right: 'ORDER BY' },

  // Level 3: Advanced Features
  { id: 't3-1', difficulty: 3, left: '피벗 테이블 (Pivot)', right: 'GROUP BY' },
  { id: 't3-2', difficulty: 3, left: '데이터 유효성 검사', right: '제약조건 (Constraint)' },
  { id: 't3-3', difficulty: 3, left: '셀 참조 (=A1)', right: '외래 키 (Foreign Key)' },
  { id: 't3-4', difficulty: 3, left: '계산된 필드', right: 'View / Function' },

  // Level 4: System Concepts
  { id: 't4-1', difficulty: 4, left: '매크로 (Macro)', right: '프로시저 (Stored Procedure)' },
  { id: 't4-2', difficulty: 4, left: '변경 내용 추적', right: '트랜잭션 로그 / Audit' },
  { id: 't4-3', difficulty: 4, left: '시트 보호 (암호)', right: '권한 관리 (GRANT/REVOKE)' },
  { id: 't4-4', difficulty: 4, left: '찾기 및 바꾸기', right: 'UPDATE 문' }
];

// --- Stage 3: Key Index (PK Selection Scenarios) ---
export const PK_SCENARIOS: TableScenario[] = [
  // Level 1
  {
    id: 's1-1', difficulty: 1, title: '학교 학생 명부',
    columns: [
      { id: 'c1', label: '이름', isPk: false, value: '홍길동' },
      { id: 'c2', label: '학번', isPk: true, value: '20241234' },
      { id: 'c3', label: '학년', isPk: false, value: '1학년' },
      { id: 'c4', label: '주소', isPk: false, value: '서울시 강남구' }
    ],
    searchTarget: '홍길동'
  },
  {
    id: 's1-2', difficulty: 1, title: '도서관 도서 목록',
    columns: [
      { id: 'c1', label: '책 제목', isPk: false, value: '해리포터' },
      { id: 'c2', label: '저자', isPk: false, value: 'J.K.롤링' },
      { id: 'c3', label: '도서등록번호', isPk: true, value: 'LIB-001-992' },
      { id: 'c4', label: '출판사', isPk: false, value: '문학수첩' }
    ],
    searchTarget: '해리포터'
  },

  // Level 2
  {
    id: 's2-1', difficulty: 2, title: '쇼핑몰 회원 관리',
    columns: [
      { id: 'c1', label: '닉네임', isPk: false, value: '멋쟁이' },
      { id: 'c2', label: '이메일', isPk: true, value: 'user@example.com' },
      { id: 'c3', label: '휴대폰번호', isPk: false, value: '010-0000-0000' }, // 변경 가능성 있음
      { id: 'c4', label: '가입일', isPk: false, value: '2024-01-01' }
    ],
    searchTarget: '멋쟁이'
  },
  {
    id: 's2-2', difficulty: 2, title: '카페 메뉴판',
    columns: [
      { id: 'c1', label: '메뉴명', isPk: false, value: '아메리카노' }, // 중복가능성(Hot/Ice)
      { id: 'c2', label: '메뉴코드', isPk: true, value: 'BEV-001' },
      { id: 'c3', label: '가격', isPk: false, value: '4500' },
      { id: 'c4', label: '카테고리', isPk: false, value: 'Coffee' }
    ],
    searchTarget: '아메리카노'
  },

  // Level 3 (Trap options)
  {
    id: 's3-1', difficulty: 3, title: '주민등록 시스템',
    columns: [
      { id: 'c1', label: '이름', isPk: false, value: '김철수' },
      { id: 'c2', label: '주민등록번호', isPk: true, value: '900101-1234567' },
      { id: 'c3', label: '지문정보', isPk: false, value: '[Binary Data]' },
      { id: 'c4', label: '거주지', isPk: false, value: '부산시 해운대구' }
    ],
    searchTarget: '김철수'
  },
  {
    id: 's3-2', difficulty: 3, title: '사내 임직원 관리',
    columns: [
      { id: 'c1', label: '사원번호', isPk: true, value: 'EMP202401' },
      { id: 'c2', label: '주민번호', isPk: false, value: '880101-1000000' }, // 보안상 PK 비권장
      { id: 'c3', label: '이메일', isPk: false, value: 'lee@company.com' }, // 변경가능
      { id: 'c4', label: '직급', isPk: false, value: '과장' }
    ],
    searchTarget: '이영희'
  },

  // Level 4 (Composite or Surrogate logic)
  {
    id: 's4-1', difficulty: 4, title: '수강 신청 내역 (다대다 관계)',
    columns: [
      { id: 'c1', label: '신청ID(Auto)', isPk: true, value: 'REQ_9991' },
      { id: 'c2', label: '학번', isPk: false, value: '2024001' }, // 중복됨
      { id: 'c3', label: '과목코드', isPk: false, value: 'CS101' }, // 중복됨
      { id: 'c4', label: '신청일시', isPk: false, value: '2024-02-20 10:00:01' }
    ],
    searchTarget: '2024001'
  },
  {
    id: 's4-2', difficulty: 4, title: '글로벌 유저 관리 (분산 환경)',
    columns: [
      { id: 'c1', label: 'User UUID', isPk: true, value: '550e8400-e29b...' },
      { id: 'c2', label: '이메일', isPk: false, value: 'global@test.com' },
      { id: 'c3', label: '가입국가', isPk: false, value: 'KR' },
      { id: 'c4', label: 'Sequence ID', isPk: false, value: '105' } // 분산환경 중복위험
    ],
    searchTarget: 'global@test.com'
  }
];

// --- Stage 4: Tech Scenarios ---
export const TECH_SCENARIOS: TechScenario[] = [
  // Level 1: Scale (Small vs Big)
  {
    id: 101, difficulty: 1,
    desc: "혼자 사용하는 '할 일 목록(To-Do)' 스마트폰 앱을 만듭니다. 서버 없이 폰 안에 데이터를 저장하고 싶습니다.",
    options: [{ label: "SQLite", correct: true }, { label: "Oracle Cloud", correct: false }],
    explanation: "모바일 로컬 저장소로는 가볍고 설정이 필요 없는 SQLite가 표준입니다."
  },
  {
    id: 102, difficulty: 1,
    desc: "전교생 500명의 성적을 관리하는 웹 사이트를 만듭니다. 여러 선생님이 동시에 접속합니다.",
    options: [{ label: "엑셀 파일 공유", correct: false }, { label: "MySQL / MariaDB", correct: true }],
    explanation: "다중 사용자 동시 접속과 데이터 무결성을 위해서는 RDBMS 서버가 필요합니다."
  },

  // Level 2: Data Structure (Structured vs Unstructured)
  {
    id: 201, difficulty: 2,
    desc: "고정된 양식의 '회원 정보'와 '주문 내역'을 관리하며, 정확한 매출 통계가 중요합니다.",
    options: [{ label: "관계형 DB (RDBMS)", correct: true }, { label: "NoSQL (MongoDB)", correct: false }],
    explanation: "데이터 구조가 명확하고 관계가 중요하며, 트랜잭션이 필요한 경우 RDBMS가 유리합니다."
  },
  {
    id: 202, difficulty: 2,
    desc: "게임에서 수시로 변하는 캐릭터의 위치 정보와 채팅 로그(형식이 제각각)를 대량으로 저장합니다.",
    options: [{ label: "PostgreSQL", correct: false }, { label: "MongoDB (NoSQL)", correct: true }],
    explanation: "데이터 구조가 유연하고 쓰기 속도가 중요한 비정형 데이터에는 NoSQL이 적합합니다."
  },

  // Level 3: Performance & Purpose
  {
    id: 301, difficulty: 3,
    desc: "초당 10만 건 이상의 '좋아요' 클릭과 '실시간 접속자 수'를 카운팅해야 합니다.",
    options: [{ label: "Redis (In-Memory)", correct: true }, { label: "MySQL (Disk)", correct: false }],
    explanation: "단순하지만 매우 빈번한 I/O가 발생하는 실시간 카운팅은 메모리 기반 DB인 Redis가 최적입니다."
  },
  {
    id: 302, difficulty: 3,
    desc: "과거 10년 치의 기상 데이터를 모아 복잡한 분석 쿼리를 돌려야 합니다. (수정은 거의 없음)",
    options: [{ label: "OLTP (MySQL)", correct: false }, { label: "OLAP (Data Warehouse)", correct: true }],
    explanation: "대용량 데이터를 분석/조회하는 용도에는 분석 전용 DB(Data Warehouse)가 적합합니다."
  },

  // Level 4: Complex Architecture
  {
    id: 401, difficulty: 4,
    desc: "페이스북처럼 친구의 친구를 타고 들어가는 '인맥 관계'를 효율적으로 탐색하고 싶습니다.",
    options: [{ label: "Graph DB (Neo4j)", correct: true }, { label: "Key-Value DB", correct: false }],
    explanation: "데이터 간의 '관계'와 '연결'을 탐색하는 데 특화된 것은 그래프 데이터베이스입니다."
  },
  {
    id: 402, difficulty: 4,
    desc: "전 세계에 흩어진 서버에서 동시에 데이터를 쓰고 읽어야 하며, 일부 서버가 죽어도 멈추면 안 됩니다 (가용성 > 일관성).",
    options: [{ label: "Cassandra", correct: true }, { label: "Single MySQL", correct: false }],
    explanation: "분산 환경에서 높은 가용성과 확장성을 보장하는 데는 Cassandra 같은 Columnar NoSQL이 유리합니다."
  }
];