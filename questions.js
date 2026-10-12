const QUESTIONS = [
  // ===== 한국사 =====
  {
    id: "hist-01",
    category: "한국사",
    question: "『삼국유사』에 신라 선덕여왕 때 쌓았다는 기록이 있고, 천문 관측 시설로 알려진 경주의 석조 건축물은?",
    choices: ["첨성대", "석굴암", "다보탑", "포석정"],
    answer: 0,
    explanation: "경주 첨성대는 신라의 천문 관측 시설로, 『삼국유사』에 선덕여왕 때 쌓았다는 기록이 있다.",
    source: { name: "한국민족문화대백과사전 「경주 첨성대」", url: "https://encykorea.aks.ac.kr/Article/E0002925" }
  },
  {
    id: "hist-02",
    category: "한국사",
    question: "충청남도 공주에서 발견되었고, 무덤 안의 지석으로 주인을 알 수 있게 된 백제 왕의 무덤은?",
    choices: ["무령왕릉", "무열왕릉", "진흥왕릉", "동명왕릉"],
    answer: 0,
    explanation: "무령왕릉은 충청남도 공주에 있는 백제 무령왕의 무덤으로, 무덤 안에서 나온 지석으로 주인을 알 수 있다.",
    source: { name: "한국민족문화대백과사전 「무령왕릉」", url: "https://encykorea.aks.ac.kr/Article/E0019018" }
  },
  {
    id: "hist-03",
    category: "한국사",
    question: "698년에 발해를 세운 고구려의 옛 장수는?",
    choices: ["대조영", "을지문덕", "연개소문", "양만춘"],
    answer: 0,
    explanation: "698년 고구려의 옛 장수 대조영이 발해를 건국했다.",
    source: { name: "한국민족문화대백과사전 「발해」", url: "https://encykorea.aks.ac.kr/Article/E0021626" }
  },
  {
    id: "hist-04",
    category: "한국사",
    question: "918년 궁예를 몰아내고 고려를 세운 인물은?",
    choices: ["견훤", "왕건", "신숭겸", "이성계"],
    answer: 1,
    explanation: "왕건은 918년 궁예를 내쫓고 고려를 세워 태조가 되었다.",
    source: { name: "한국민족문화대백과사전 「태조」", url: "https://encykorea.aks.ac.kr/Article/E0059032" }
  },
  {
    id: "hist-05",
    category: "한국사",
    question: "팔만대장경을 보관하고 있는 장경판전이 있는 절은?",
    choices: ["불국사", "통도사", "해인사", "송광사"],
    answer: 2,
    explanation: "경상남도 합천 해인사의 장경판전은 팔만대장경을 보관하는 건물이다.",
    source: { name: "한국민족문화대백과사전 「합천 해인사 장경판전」", url: "https://encykorea.aks.ac.kr/Article/E0062725" }
  },
  {
    id: "hist-06",
    category: "한국사",
    question: "1443년에 훈민정음을 만든 조선의 왕은?",
    choices: ["태종", "세종", "세조", "성종"],
    answer: 1,
    explanation: "세종은 1443년 훈민정음을 만들었고, 1446년에는 이를 풀이한 책 『훈민정음』(해례본)이 나왔다.",
    source: { name: "한국민족문화대백과사전 「한글」", url: "https://encykorea.aks.ac.kr/Article/E0061508" }
  },
  {
    id: "hist-07",
    category: "한국사",
    question: "1392년 고려를 대신해 조선을 세우고 첫 번째 왕이 된 인물은?",
    choices: ["이성계", "이방원", "정몽주", "정도전"],
    answer: 0,
    explanation: "태조 이성계는 1392년부터 1398년까지 재위한 조선의 제1대 왕이다.",
    source: { name: "한국민족문화대백과사전 「태조」", url: "https://encykorea.aks.ac.kr/Article/E0059033" }
  },
  {
    id: "hist-08",
    category: "한국사",
    question: "정조 때 쌓기 시작해 1796년에 완성한 성곽은?",
    choices: ["수원 화성", "남한산성", "북한산성", "행주산성"],
    answer: 0,
    explanation: "수원 화성은 정조 때 쌓기 시작해 1796년에 완성한 성곽이다.",
    source: { name: "한국민족문화대백과사전 「수원 화성」", url: "https://encykorea.aks.ac.kr/Article/E0064671" }
  },
  {
    id: "hist-09",
    category: "한국사",
    question: "민족대표 33인이 독립을 선언하며 시작된 거족적인 독립만세운동, 3·1운동이 일어난 해는?",
    choices: ["1910년", "1919년", "1926년", "1945년"],
    answer: 1,
    explanation: "3·1운동은 1919년 3월 1일을 기해 일어난 거족적인 독립만세운동이다.",
    source: { name: "한국민족문화대백과사전 「3·1운동」", url: "https://encykorea.aks.ac.kr/Article/E0026772" }
  },
  {
    id: "hist-10",
    category: "한국사",
    question: "1919년 4월 대한민국임시정부가 수립된 도시는?",
    choices: ["상하이", "충칭", "베이징", "도쿄"],
    answer: 0,
    explanation: "대한민국임시정부는 1919년 4월 중국 상하이에서 수립되었다.",
    source: { name: "한국민족문화대백과사전 「대한민국 임시정부 수립 기념일」", url: "https://encykorea.aks.ac.kr/Article/E0080590" }
  },

  // ===== 세계지리 =====
  {
    id: "geo-01",
    category: "세계지리",
    question: "오스트레일리아의 수도는?",
    choices: ["캔버라", "시드니", "멜버른", "퍼스"],
    answer: 0,
    explanation: "캔버라는 오스트레일리아 연방의 수도이다.",
    source: { name: "브리태니커 「Canberra」", url: "https://www.britannica.com/place/Canberra" }
  },
  {
    id: "geo-02",
    category: "세계지리",
    question: "사하라 사막은 어느 대륙의 북부를 거의 다 차지하고 있나?",
    choices: ["아프리카", "아시아", "오세아니아", "남아메리카"],
    answer: 0,
    explanation: "사하라 사막은 아프리카 북부의 거의 전부를 차지하는 사막이다.",
    source: { name: "브리태니커 「Sahara」", url: "https://www.britannica.com/place/Sahara-desert-Africa" }
  },
  {
    id: "geo-03",
    category: "세계지리",
    question: "남아메리카 대륙에 길게 이어진 산맥은?",
    choices: ["안데스산맥", "로키산맥", "알프스산맥", "우랄산맥"],
    answer: 0,
    explanation: "안데스산맥은 남아메리카 대륙에 끊김 없이 길게 이어진 산맥이다.",
    source: { name: "브리태니커 「Andes Mountains」", url: "https://www.britannica.com/place/Andes-Mountains" }
  },
  {
    id: "geo-04",
    category: "세계지리",
    question: "아프리카 북동부를 지나 북쪽으로 흐르는 나일강이 흘러 들어가는 바다는?",
    choices: ["지중해", "홍해", "아라비아해", "카스피해"],
    answer: 0,
    explanation: "나일강은 적도 남쪽에서 시작해 아프리카 북동부를 지나 북쪽으로 흘러 지중해로 들어간다.",
    source: { name: "브리태니커 「Nile River」", url: "https://www.britannica.com/place/Nile-River" }
  },
  {
    id: "geo-05",
    category: "세계지리",
    question: "브라질 전역에서 쓰이는 언어는?",
    choices: ["포르투갈어", "스페인어", "프랑스어", "이탈리아어"],
    answer: 0,
    explanation: "브라질에서는 포르투갈어가 나라 전역에서 쓰인다.",
    source: { name: "브리태니커 「Brazil」", url: "https://www.britannica.com/place/Brazil" }
  },
  {
    id: "geo-06",
    category: "세계지리",
    question: "지구를 북반구와 남반구로 나누는, 위도 0°의 선은?",
    choices: ["적도", "북회귀선", "남회귀선", "북극권"],
    answer: 0,
    explanation: "적도는 지구를 북반구와 남반구로 나누는 위도 0°의 선이다.",
    source: { name: "브리태니커 「Equator」", url: "https://www.britannica.com/place/Equator" }
  },
  {
    id: "geo-07",
    category: "세계지리",
    question: "빙하가 깎아 만든 골짜기에 바닷물이 들어와 생긴, 좁고 긴 만을 무엇이라 하나?",
    choices: ["피오르", "리아스", "석호", "삼각주"],
    answer: 0,
    explanation: "피오르는 빙하가 깎은 골짜기가 바닷물에 잠겨 생긴 좁고 긴 바다의 만이다.",
    source: { name: "브리태니커 「fjord」", url: "https://www.britannica.com/science/fjord" }
  },
  {
    id: "geo-08",
    category: "세계지리",
    question: "킬리만자로산이 있는 나라는?",
    choices: ["탄자니아", "에티오피아", "우간다", "모로코"],
    answer: 0,
    explanation: "킬리만자로산은 탄자니아 북동부에 있는 화산 산괴이다.",
    source: { name: "브리태니커 「Kilimanjaro」", url: "https://www.britannica.com/place/Kilimanjaro" }
  },
  {
    id: "geo-09",
    category: "세계지리",
    question: "여름은 덥고 건조하며, 겨울은 서늘하고 비가 많은 기후는?",
    choices: ["지중해성 기후", "열대 우림 기후", "사바나 기후", "툰드라 기후"],
    answer: 0,
    explanation: "지중해성 기후는 덥고 건조한 여름과 서늘하고 습한 겨울이 특징인 기후형이다.",
    source: { name: "브리태니커 「Mediterranean climate」", url: "https://www.britannica.com/science/Mediterranean-climate" }
  },
  {
    id: "geo-10",
    category: "세계지리",
    question: "흑해와 마르마라해를 잇고, 튀르키예의 아시아 쪽과 유럽 쪽을 나누는 해협은?",
    choices: ["보스포루스 해협", "지브롤터 해협", "호르무즈 해협", "모잠비크 해협"],
    answer: 0,
    explanation: "보스포루스 해협은 흑해와 마르마라해를 잇고 튀르키예의 아시아 쪽과 유럽 쪽을 나눈다.",
    source: { name: "브리태니커 「Bosporus」", url: "https://www.britannica.com/place/Bosporus" }
  },

  // ===== 과학 =====
  {
    id: "sci-01",
    category: "과학",
    question: "힘을 받지 않는 물체는 정지해 있거나 같은 속도로 직선 운동을 계속한다는 뉴턴의 제1법칙은?",
    choices: ["관성의 법칙", "가속도의 법칙", "작용 반작용 법칙", "만유인력의 법칙"],
    answer: 0,
    explanation: "뉴턴의 제1법칙인 관성의 법칙은 힘이 작용하지 않으면 물체가 정지 상태나 등속 직선 운동을 유지한다는 법칙이다.",
    source: { name: "브리태니커 「Newton’s laws of motion」", url: "https://www.britannica.com/science/Newtons-laws-of-motion" }
  },
  {
    id: "sci-02",
    category: "과학",
    question: "국제단위계(SI)에서 전류의 단위는?",
    choices: ["암페어", "볼트", "옴", "와트"],
    answer: 0,
    explanation: "암페어는 국제단위계(SI)에서 전류의 단위이다.",
    source: { name: "브리태니커 「ampere」", url: "https://www.britannica.com/science/ampere" }
  },
  {
    id: "sci-03",
    category: "과학",
    question: "원자 번호가 1인 원소는?",
    choices: ["수소", "헬륨", "산소", "탄소"],
    answer: 0,
    explanation: "수소는 원자 번호가 1인 원소이다.",
    source: { name: "브리태니커 「hydrogen」", url: "https://www.britannica.com/science/hydrogen" }
  },
  {
    id: "sci-04",
    category: "과학",
    question: "원소를 원자량 순서로 늘어놓으면 성질이 주기적으로 되풀이된다는 것을 찾아 원소의 주기적 분류를 만든 러시아 화학자는?",
    choices: ["멘델레예프", "라부아지에", "아보가드로", "베르셀리우스"],
    answer: 0,
    explanation: "멘델레예프는 원소를 원자량이 커지는 순서로 배열하면 성질이 주기적으로 되풀이됨을 찾아 원소의 주기적 분류를 만든 러시아 화학자이다.",
    source: { name: "브리태니커 「Dmitri Mendeleev」", url: "https://www.britannica.com/biography/Dmitri-Mendeleev" }
  },
  {
    id: "sci-05",
    category: "과학",
    question: "원소 기호가 Fe인 원소는?",
    choices: ["철", "불소", "금", "납"],
    answer: 0,
    explanation: "철은 원소 기호가 Fe이고 원자 번호가 26인 금속 원소이다.",
    source: { name: "브리태니커 「iron」", url: "https://www.britannica.com/science/iron-chemical-element" }
  },
  {
    id: "sci-06",
    category: "과학",
    question: "식물과 녹조류의 세포에서 광합성이 일어나는 곳은?",
    choices: ["엽록체", "골지체", "리보솜", "세포핵"],
    answer: 0,
    explanation: "엽록체는 식물과 녹조류의 세포 안에서 빛에너지를 화학 에너지로 바꾸는 광합성이 일어나는 구조이다.",
    source: { name: "브리태니커 「chloroplast」", url: "https://www.britannica.com/science/chloroplast" }
  },
  {
    id: "sci-07",
    category: "과학",
    question: "1953년 DNA가 두 가닥이 꼬인 이중 나선 구조라고 밝힌 과학자는?",
    choices: ["왓슨과 크릭", "다윈과 월리스", "파스퇴르와 코흐", "멘델과 모건"],
    answer: 0,
    explanation: "1953년 왓슨과 크릭은 여러 연구자의 실험 자료를 바탕으로 DNA를 서로 꼬인 두 가닥의 이중 나선 구조로 설명했다.",
    source: { name: "브리태니커 「DNA」", url: "https://www.britannica.com/science/DNA" }
  },
  {
    id: "sci-08",
    category: "과학",
    question: "혈액 속에서 폐의 산소를 몸 곳곳의 조직으로 운반하는 세포는?",
    choices: ["적혈구", "백혈구", "혈소판", "림프구"],
    answer: 0,
    explanation: "적혈구는 철을 포함한 단백질인 헤모글로빈으로 산소를 붙잡아 폐에서 온몸의 조직으로 운반한다.",
    source: { name: "브리태니커 「red blood cell」", url: "https://www.britannica.com/science/red-blood-cell" }
  },
  {
    id: "sci-09",
    category: "과학",
    question: "모스 굳기계에서 굳기가 1인 광물은?",
    choices: ["활석", "석고", "형석", "석영"],
    answer: 0,
    explanation: "모스 굳기계에서 활석은 굳기가 1로, 손톱으로도 아주 쉽게 긁힌다.",
    source: { name: "브리태니커 「Mohs hardness」", url: "https://www.britannica.com/science/Mohs-hardness" }
  },
  {
    id: "sci-10",
    category: "과학",
    question: "흙 속의 철 광물이 산화되어 표면이 붉게 보이는, '붉은 행성'이라 불리는 행성은?",
    choices: ["화성", "금성", "목성", "토성"],
    answer: 0,
    explanation: "화성은 흙 속의 철 광물이 산화해 녹슬면서 표면이 붉게 보여 '붉은 행성'이라 불린다.",
    source: { name: "NASA 「Mars: Facts」", url: "https://science.nasa.gov/mars/facts/" }
  },

  // ===== 예술과 문화 =====
  {
    id: "art-01",
    category: "예술과 문화",
    question: "파리 루브르 박물관에 있는 「모나리자」를 그린 화가는?",
    choices: ["다빈치", "미켈란젤로", "라파엘로", "렘브란트"],
    answer: 0,
    explanation: "「모나리자」는 레오나르도 다빈치가 나무판에 유채로 그린 그림으로, 파리 루브르 박물관에 있다.",
    source: { name: "브리태니커 「Mona Lisa」", url: "https://www.britannica.com/topic/Mona-Lisa-painting" }
  },
  {
    id: "art-02",
    category: "예술과 문화",
    question: "1889년 프랑스 생레미에서 그린 「별이 빛나는 밤」의 화가는?",
    choices: ["고흐", "모네", "세잔", "피카소"],
    answer: 0,
    explanation: "「별이 빛나는 밤」은 빈센트 반 고흐가 1889년 생레미에서 캔버스에 유채로 그린 그림이다.",
    source: { name: "뉴욕 현대미술관(MoMA) 「The Starry Night」", url: "https://www.moma.org/collection/works/79802" }
  },
  {
    id: "art-03",
    category: "예술과 문화",
    question: "비 온 뒤의 인왕산 경치를 그린 「인왕제색도」의 화가는?",
    choices: ["정선", "김홍도", "신윤복", "안견"],
    answer: 0,
    explanation: "「인왕제색도」는 정선이 비 온 뒤의 인왕산 경치를 보고 그린 그림이다.",
    source: { name: "한국민족문화대백과사전 「정선 필 인왕제색도」", url: "https://encykorea.aks.ac.kr/Article/E0046984" }
  },
  {
    id: "art-04",
    category: "예술과 문화",
    question: "교향곡 제9번에서 성악과 기악을 이전에 없던 방식으로 결합했으며, 점점 청력을 잃어 가는 고통과 싸운 작곡가는?",
    choices: ["베토벤", "모차르트", "바흐", "차이콥스키"],
    answer: 0,
    explanation: "베토벤은 교향곡 제9번에서 그때까지 시도된 적 없는 방식으로 성악과 기악을 결합했다.",
    source: { name: "브리태니커 「Ludwig van Beethoven」", url: "https://www.britannica.com/biography/Ludwig-van-Beethoven" }
  },
  {
    id: "art-05",
    category: "예술과 문화",
    question: "2막으로 된 독일어 노래극(징슈필) 「마술피리」를 작곡한 사람은?",
    choices: ["모차르트", "베르디", "푸치니", "바그너"],
    answer: 0,
    explanation: "「마술피리」는 모차르트가 작곡한 2막의 징슈필이다.",
    source: { name: "브리태니커 「The Magic Flute」", url: "https://www.britannica.com/topic/The-Magic-Flute" }
  },
  {
    id: "art-06",
    category: "예술과 문화",
    question: "한 명의 창자가 고수의 북장단에 맞추어 노래와 말(아니리)로 긴 이야기를 엮고 몸짓(발림)을 곁들이는 전통 공연 예술은?",
    choices: ["판소리", "탈춤", "민요", "산조"],
    answer: 0,
    explanation: "판소리는 한 명의 창자가 고수의 북장단에 맞추어 서사적인 이야기를 소리와 아니리로 엮어 발림을 곁들이며 구연하는 전통 공연 예술이다.",
    source: { name: "한국민족문화대백과사전 「판소리」", url: "https://encykorea.aks.ac.kr/Article/E0059663" }
  },
  {
    id: "art-07",
    category: "예술과 문화",
    question: "5막 비극 「햄릿」을 쓴 작가는?",
    choices: ["셰익스피어", "괴테", "몰리에르", "세르반테스"],
    answer: 0,
    explanation: "「햄릿」은 윌리엄 셰익스피어가 쓴 5막 비극이다.",
    source: { name: "브리태니커 「Hamlet」", url: "https://www.britannica.com/topic/Hamlet-by-Shakespeare" }
  },
  {
    id: "art-08",
    category: "예술과 문화",
    question: "「진달래꽃」·「산유화」·「초혼」 등을 실은 시집 『진달래꽃』의 시인은?",
    choices: ["김소월", "윤동주", "한용운", "이육사"],
    answer: 0,
    explanation: "『진달래꽃』은 김소월의 시 「진달래꽃」·「산유화」·「초혼」 등을 실은 시집이다.",
    source: { name: "한국민족문화대백과사전 「진달래꽃」", url: "https://encykorea.aks.ac.kr/Article/E0054622" }
  },
  {
    id: "art-09",
    category: "예술과 문화",
    question: "무굴 제국 황제 샤자한이 왕비 뭄타즈 마할을 기리려고 인도 아그라에 지은 무덤 건축물은?",
    choices: ["타지마할", "피라미드", "진시황릉", "앙코르와트"],
    answer: 0,
    explanation: "타지마할은 무굴 제국 황제 샤자한이 왕비 뭄타즈 마할을 기리려고 지은 인도 아그라의 무덤 건축물이다.",
    source: { name: "브리태니커 「Taj Mahal」", url: "https://www.britannica.com/topic/Taj-Mahal" }
  },
  {
    id: "art-10",
    category: "예술과 문화",
    question: "안토니 가우디가 설계한 스페인 바르셀로나의 성당은?",
    choices: ["사그라다 파밀리아", "노트르담 대성당", "성 베드로 대성당", "캔터베리 대성당"],
    answer: 0,
    explanation: "사그라다 파밀리아는 안토니 가우디가 설계한 스페인 바르셀로나의 성당이다.",
    source: { name: "브리태니커 「Sagrada Família」", url: "https://www.britannica.com/topic/Sagrada-Familia" }
  },
];
