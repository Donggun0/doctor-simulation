// data.js
// Korean scenario data for "Try Being a Doctor"

const scenarios = [
    {
        id: "common_cold",
        text: "선생님, 콧물이 좀 나고 머리가 띵해요. 주사 한 방 놔주세요.",
        narrator: "단순 감기다. 주사는 과잉진료지만 환자는 강력히 원한다.",
        patientInfo: {
            age: 28,
            gender: 'M',
            bp: "130/85",
            hr: 82,
            bt: 37.5,
            history: "특이사항 없음"
        },
        choices: [
            { label: "항생제 처방+주사 (과잉)", effect: { revenue: 15000, satisfaction: 10, mental: 0, adminRisk: 5 }, log: "환자는 만족하며 갔지만, 심평원 레이더에 잡힐지도..." },
            { label: "증상 조절 약만 처방", effect: { revenue: 5000, satisfaction: -5, mental: 0, adminRisk: 0 }, log: "환자: '아니 주사 안 줘요?' 투덜거리며 나갔다." },
            { label: "타이레놀 먹고 쉬세요", effect: { revenue: 3000, satisfaction: -20, mental: -5, adminRisk: 0 }, log: "돈도 안 되고 욕만 먹었다." }
        ]
    },
    {
        id: "hypertension_case",
        text: "뒷목이 뻐근해서 왔어요. 파스 좀 주세요.",
        narrator: "혈압이 160/100이다. 파스가 문제가 아니다!",
        image: "assets/patient_pleading.png", // Fallback to pleading
        patientInfo: {
            age: 55,
            gender: 'M',
            bp: "160/100", // High
            hr: 88,
            bt: 36.8,
            history: "고혈압 가족력"
        },
        choices: [
            { label: "혈압약 처방 및 교육", effect: { revenue: 8000, satisfaction: -5, mental: -5, adminRisk: 0 }, log: "환자: '아니 파스 달라니까요?' 설득하느라 진이 빠졌다." },
            { label: "원하는 대로 파스 처방", effect: { revenue: 4000, satisfaction: 10, mental: 0, adminRisk: 15 }, log: "환자는 좋아했지만, 이 사람 쓰러지면 내 탓이다." },
            { label: "상급병원 의뢰서 발급", effect: { revenue: 12000, satisfaction: 5, mental: 10, adminRisk: 0 }, log: "책임을 떠넘겼다. (의뢰서 비용 꿀꺽)" }
        ]
    },
    {
        id: "allergy_trap",
        text: "목이 너무 부었어요. 항생제 센 걸로 주세요. 회사 가야 해요.",
        narrator: "차트를 보자. 페니실린 쇼크 이력이 있다.",
        patientInfo: {
            age: 34,
            gender: 'F',
            bp: "120/80",
            hr: 90,
            bt: 38.2,
            history: "🔴 페니실린 알러지"
        },
        choices: [
            { label: "페니실린계 항생제 처방", effect: { revenue: 0, satisfaction: -100, mental: -50, adminRisk: 100 }, log: "🚨 아나필락시스 쇼크! 응급실 실려감. 소송 확정." },
            { label: "다른 계열 항생제 처방", effect: { revenue: 7000, satisfaction: 5, mental: 0, adminRisk: 0 }, log: "안전하게 처방했다. 환자는 약 이름 따윈 모른다." },
            { label: "주사 투여 (항히스타민)", effect: { revenue: 10000, satisfaction: 15, mental: 0, adminRisk: 5 }, log: "증상이 빨리 가라앉아 환자가 매우 만족했다." }
        ]
    },
    {
        id: "skip_bp_check",
        text: "혈압약 먹던 거 그대로 3개월치 주세요. 바빠 죽겠는데 무슨 혈압을 또 재요? 그냥 줘요!",
        narrator: "환자 얼굴이 붉다. 혈압이 꽤 높아 보이는데 측정을 거부한다.",
        patientInfo: {
            age: 62,
            gender: 'M',
            bp: "???/???", // Unknown unless measured
            hr: 90,
            bt: 37.1,
            history: "고혈압 본태성"
        },
        choices: [
            { label: "원하는 대로 3개월 처방 (측정X)", effect: { revenue: 15000, satisfaction: 20, mental: 0, adminRisk: 20 }, log: "환자는 '역시 여기가 빨라서 좋아'라며 갔다. 찜찜하다." },
            { label: "지금 얼굴이 붉으세요. 재봐야 합니다", effect: { revenue: 5000, satisfaction: -20, mental: -5, adminRisk: 0 }, log: "측정 결과 160/105. 약 용량을 조절했다. 환자는 투덜거림." },
            { label: "측정 거부 시 처방 불가합니다", effect: { revenue: 0, satisfaction: -40, mental: -10, adminRisk: 0 }, log: "환자가 접수대에서 소리를 지르고 다른 병원으로 갔다." }
        ]
    },
    {
        id: "dangerous_work",
        text: "선생님, 저 오늘 현장 나가야 하는데 '근로 가능' 소견서 좀 써주세요. 200/100? 아 컨디션 좋아서 그래요!",
        narrator: "혈압이 200/110mmHg. 고혈압 응급(Hypertensive Emergency) 수준이다. 일하다 터진다.",
        image: "assets/patient_angry.png", // Fixed image path
        patientInfo: {
            age: 45,
            gender: 'M',
            bp: "200/110",
            hr: 110,
            bt: 37.2,
            history: "고혈압/당뇨 (약 중단)"
        },
        choices: [
            { label: "원하는 대로 소견서 발급", effect: { revenue: 30000, satisfaction: 20, mental: 0, adminRisk: 60 }, log: "돈은 벌었지만, 뉴스 사회면에 나올 수도 있습니다. '현장서 쓰러진 노동자...'" },
            { label: "당장 응급실로 가셔야 합니다! (진료거부)", effect: { revenue: 0, satisfaction: -10, mental: -5, adminRisk: 0 }, log: "환자를 설득해 상급병원으로 보냈다. 생명은 살렸다." },
            { label: "주사 맞고 좀 쉬었다 다시 재봅시다", effect: { revenue: 10000, satisfaction: -5, mental: -5, adminRisk: 10 }, log: "혈압이 180까지 떨어졌지만 여전히 위험하다." }
        ]
    },
    {
        id: "certificate_request",
        text: "회사 제출용 진단서 하나 끊어주세요. 3일 쉬어야 한다고요.",
        narrator: "멀쩡해 보인다. 그냥 쉬고 싶은 모양이다.",
        patientInfo: {
            age: 26,
            gender: 'F',
            bp: "115/75",
            hr: 70,
            bt: 36.5,
            history: "특이사항 없음"
        },
        choices: [
            { label: "3일 휴식 진단서 발급", effect: { revenue: 20000, satisfaction: 20, mental: 0, adminRisk: 30 }, log: "2만원 벌었지만 허위진단서 리스크가..." },
            { label: "진료확인서만 발급", effect: { revenue: 3000, satisfaction: -10, mental: -5, adminRisk: 0 }, log: "환자: '아 센스 없네 진짜'" },
            { label: "거절한다", effect: { revenue: 0, satisfaction: -30, mental: -10, adminRisk: 0 }, log: "환자가 접수처에서 소리를 지르고 갔다." }
        ]
    },
    // 1. Demand Type: Sleeping Pills
    {
        id: "demand_zolpidem",
        stage: 1,
        type: "demand",
        text: "선생님, 저 잠 좀 자게 약 좀 주세요. 다른 병원 약은 다 끊었어요.",
        narrator: "환자가 졸피뎀 처방을 강하게 요구합니다. 중복 처방 이력이 보입니다.",
        image: "assets/patient_pleading.png",
        patientInfo: {
            age: 38,
            gender: 'F',
            bp: "135/85",
            hr: 92,
            bt: 36.6,
            history: "불면증/우울증"
        },
        choices: [
            {
                label: "원하는 대로 짧게(3일분) 처방한다",
                effect: { hp: 0, mental: -5, adminRisk: +10, satisfaction: +20, revenue: +5000 },
                log: "환자는 만족했습니다. (수익 +5,000₩)",
                next: "next_random"
            },
            {
                label: "수면 위생 교육만 하고 돌려보낸다",
                effect: { hp: -5, mental: -10, adminRisk: 0, satisfaction: -20, revenue: +3000 },
                log: "환자가 문을 쾅 닫고 나갔습니다. (수익 +3,000₩)",
                hidden: { complaintFlag: true },
                next: "next_random"
            },
            {
                label: "비습관성 수면유도제(멜라토닌 등)를 권유한다",
                effect: { hp: -2, mental: -5, adminRisk: 0, satisfaction: 0, revenue: +7000 },
                log: "환자가 마지못해 받아갔지만, 비급여라 매출엔 도움됩니다. (수익 +7,000₩)",
                next: "next_random"
            }
        ]
    },
    // 2. Shield Type: Antibiotic Demand
    {
        id: "shield_antibiotic",
        stage: 1,
        type: "shield",
        text: "목이 부은 것 같아요. 항생제 좀 주세요. 다른 병원에선 주던데?",
        narrator: "전형적인 바이러스성 감기 증상입니다. 항생제는 필요 없습니다.",
        image: "assets/patient_angry.png",
        patientInfo: {
            age: 33,
            gender: 'F',
            bp: "120/80",
            hr: 95,
            bt: 38.2, // Fever
            history: "인후통"
        },
        choices: [
            {
                label: "예방 차원에서 항생제를 처방한다",
                effect: { hp: 0, mental: -5, adminRisk: +15, satisfaction: +15, revenue: +4000 },
                log: "환자는 안심하지만 항생제 적정성 평가는 떨어집니다. (수익 +4,000₩)",
                next: "next_random"
            },
            {
                label: "바이러스 질환이라 설명하고 거절한다",
                effect: { hp: -10, mental: -15, adminRisk: 0, satisfaction: -25, revenue: +3000 },
                log: "'돌팔이네' 소리를 들었지만, 소신을 지켰습니다. (수익 +3,000₩)",
                next: "next_random"
            },
            {
                label: "증상 완화제만 주되, 3일 뒤에도 아프면 오라고 한다",
                effect: { hp: -5, mental: -5, adminRisk: 0, satisfaction: +5, revenue: +3000 },
                log: "재진을 유도하는 교과서적 대처입니다. (수익 +3,000₩)",
                next: "next_random"
            }
        ]
    },
    // 3. Complaint Warning: CCTV
    {
        id: "warning_cctv",
        stage: 2,
        type: "warning",
        text: "아까 수액 맞을 때 지갑이 없어진 것 같은데, CCTV 좀 봅시다.",
        narrator: "수액실은 개인 공간이라 CCTV 설치가 불법입니다 (또는 없습니다).",
        image: "assets/patient_recording.png",
        patientInfo: {
            age: 42,
            gender: 'M',
            bp: "140/90", // Angry
            hr: 100,
            bt: 36.5,
            history: "특이사항 없음"
        },
        choices: [
            {
                label: "규정상 보여드릴 수 없다고 설명한다",
                effect: { hp: -10, mental: -20, adminRisk: 0, satisfaction: -40, revenue: 0 },
                log: "환자가 경찰을 부르겠다며 로비에서 소리를 지릅니다. (수익 0₩)",
                next: "next_random"
            },
            {
                label: "경찰 입회 하에 확인 가능하다고 안내한다",
                effect: { hp: -5, mental: -10, adminRisk: 0, satisfaction: -20, revenue: 0 },
                log: "환자가 분을 삭히지 못하고 계속 투덜거립니다. (수익 0₩)",
                next: "next_random"
            },
            {
                label: "같이 찾아보는 척이라도 해준다",
                effect: { hp: -15, mental: -5, adminRisk: 0, satisfaction: +10, revenue: 0 },
                log: "결국 환자 가방 구석에서 지갑이 나왔습니다. 허탈합니다. (수익 0₩)",
                next: "next_random"
            }
        ]
    },
    // 4. Test Obsession: COVID/Flu (High Revenue Potential)
    {
        id: "test_obsession",
        stage: 2,
        type: "test_obsession",
        text: "요즘 독감 유행이라는데 검사 다 해주세요. 실비 되죠?",
        narrator: "열도 없고 기침도 없습니다. 검사가 불필요해 보입니다.",
        image: "assets/patient_pleading.png",
        patientInfo: {
            age: 27,
            gender: 'F',
            bp: "110/70",
            hr: 65,
            bt: 36.4, // Not sick
            history: "건강염려증"
        },
        choices: [
            {
                label: "원하는 검사를 다 해준다 (독감+코로나)",
                effect: { hp: -5, mental: 0, adminRisk: +20, satisfaction: +30, revenue: +60000 },
                log: "검사 결과는 음성입니다. 매출은 짭짤하지만 삭감 위험이 있습니다. (수익 +60,000₩)",
                next: "next_random"
            },
            {
                label: "증상이 없으면 검사가 어렵다고 한다",
                effect: { hp: -10, mental: -15, adminRisk: 0, satisfaction: -30, revenue: +3000 },
                log: "환자가 '검사비 벌기 싫으냐'며 비아냥거립니다. (수익 +3,000₩)",
                next: "next_random"
            },
            {
                label: "비급여 검사는 가능하다고 안내한다",
                effect: { hp: -5, mental: -5, adminRisk: 0, satisfaction: +10, revenue: +30000 },
                log: "환자가 비싸다며 독감 검사 하나만 하고 갑니다. (수익 +30,000₩)",
                next: "next_random"
            }
        ]
    },
    // 5. Diet Pills (High Risk, High Satisfaction)
    {
        id: "demand_diet",
        stage: 3,
        type: "demand",
        text: "다이어트 약(삭센다/펜터민) 처방해주세요. 친구가 여기서 받았다던데.",
        narrator: "혈압이 160/100입니다. 이 상태에서 처방은 매우 위험합니다.",
        image: "assets/patient_pleading.png",
        patientInfo: {
            age: 39,
            gender: 'F',
            bp: "160/100", // CONTRAINDICATION
            hr: 88,
            bt: 36.7,
            history: "고혈압/비만"
        },
        choices: [
            {
                label: "환자가 원하므로 처방해준다 (비급여)",
                effect: { hp: 0, mental: +5, adminRisk: +40, satisfaction: +30, revenue: +20000 },
                log: "비급여 처방이라 수익은 좋지만, 뇌출혈이라도 오면 끝장입니다. (수익 +20,000₩)",
                next: "next_random"
            },
            {
                label: "혈압 때문에 절대 안 된다고 거절한다",
                effect: { hp: -10, mental: -10, adminRisk: 0, satisfaction: -30, revenue: +3000 },
                log: "진료비도 내기 싫다는 듯 카드를 던집니다. (수익 +3,000₩)",
                next: "next_random"
            },
            {
                label: "혈압약부터 드셔야 처방 가능하다고 설득한다",
                effect: { hp: -15, mental: -5, adminRisk: 0, satisfaction: -5, revenue: +5000 },
                log: "긴 실랑이 끝에 혈압약만 처방받아 갑니다. (수익 +5,000₩)",
                next: "next_random"
            }
        ]
    },
    // 8. The AI Doctor Believer
    {
        id: "ai_believer_gpt",
        stage: 2,
        type: "smart",
        text: "챗GPT랑 제미나이한테 물어보니까 이 증상엔 스테로이드 쓰라던데요? 왜 안 줘요?",
        narrator: "AI 진단을 맹신하며 스마트폰을 눈앞에 들이밉니다.",
        image: "assets/patient_smart.png",
        patientInfo: {
            age: 25,
            gender: 'M',
            bp: "120/80",
            hr: 75,
            bt: 36.5,
            history: "인터넷 검색 과다"
        },
        choices: [
            {
                label: "AI보다 전문가 소견이 중요함을 설명한다",
                effect: { hp: -10, mental: -15, adminRisk: 0, satisfaction: -20, revenue: +3000 },
                log: "환자는 'AI가 의사보다 공부 더 많이 하거든요?'라며 비웃습니다. (수익 +3,000₩)",
                next: "next_random"
            },
            {
                label: "원하는 대로 처방해준다",
                effect: { hp: 0, mental: -5, adminRisk: +25, satisfaction: +30, revenue: +4000 },
                log: "편하긴 하지만 자괴감이 듭니다. (수익 +4,000₩)",
                next: "next_random"
            },
            {
                label: "AI가 책임져주지 않는다고 경고한다",
                effect: { hp: -5, mental: -5, adminRisk: 0, satisfaction: -10, revenue: +3000 },
                log: "환자가 입을 다물지만 기분 나쁜 티를 팍팍 냅니다. (수익 +3,000₩)",
                next: "next_random"
            }
        ]
    },
    // 9. Privacy Trap (Mom)
    {
        id: "privacy_mom",
        stage: 2,
        type: "warning",
        text: "우리 아들 진료 기록 떼주세요. 보험 청구해야 돼서.",
        narrator: "아들은 30세 성인입니다. 위임장 없이는 발급 불가능합니다.",
        image: "assets/patient_pleading.png",
        patientInfo: {
            age: 58,
            gender: 'F',
            bp: "125/80",
            hr: 70,
            bt: 36.2,
            history: "특이사항 없음"
        },
        choices: [
            {
                label: "위임장 없이 해준다 (귀찮아서)",
                effect: { hp: 0, mental: +5, adminRisk: +50, satisfaction: +20, revenue: +20000 },
                log: "서류 발급비 2만원을 벌었지만, 의료법 위반으로 고발당할 수 있습니다. (수익 +20,000₩)",
                next: "next_random"
            },
            {
                label: "서류 없이는 절대 안 된다고 거절한다",
                effect: { hp: -10, mental: -10, adminRisk: 0, satisfaction: -30, revenue: 0 },
                log: "환자가 '내가 낳았는데 왜 안 되냐'며 로비에서 난동을 부립니다. (수익 0₩)",
                next: "next_random"
            },
            {
                label: "아들과 통화시켜 달라고 한다",
                effect: { hp: -10, mental: -5, adminRisk: 0, satisfaction: -5, revenue: 0 },
                log: "아들이 전화를 안 받아서 결국 환자가 화내며 돌아갑니다. (수익 0₩)",
                next: "next_random"
            }
        ]
    },
    // 10. The Discount Beggar
    {
        id: "discount_beggar",
        stage: 3,
        type: "money",
        text: "비급여 주사 맞을 건데, 좀 깎아줘요. 단골이잖아.",
        narrator: "비급여 할인은 환자 유인 행위로 불법 소지가 있습니다.",
        image: "assets/patient_angry.png",
        patientInfo: { age: 65, gender: 'M', bp: "130/80", hr: 75, bt: 36.5, history: "단골 환자" },
        choices: [
            {
                label: "딱 잘라서 안 된다고 거절한다",
                effect: { hp: -5, mental: -10, adminRisk: 0, satisfaction: -30, revenue: 0 },
                log: "'동네 인심 야박하네'라며 그냥 나갑니다. (수익 0₩)",
                next: "next_random"
            },
            {
                label: "이번만 특별히 10% 할인해준다",
                effect: { hp: 0, mental: 0, adminRisk: +30, satisfaction: +30, revenue: +45000 },
                log: "환자는 좋아하지만, 다른 환자들에게 소문낼까 두렵습니다. (주사비 +45,000₩)",
                next: "next_random"
            },
            {
                label: "할인 대신 영양제 서비스(원가 500원)를 준다",
                effect: { hp: -5, mental: -5, adminRisk: 0, satisfaction: +10, revenue: +50000 },
                log: "조삼모사지만 환자는 무언가 받았다며 좋아합니다. (주사비 +50,000₩)",
                next: "next_random"
            }
        ]
    }, // Added missing comma
    // --- New Scenarios (Sprite Based) ---
    // from chars_set_1.jpg (Doctor on left, 2x2 grid on right)
    {
        id: "vlogger_threat",
        text: "원장님, 이거 녹음 중이니까 말조심하세요. 제 구독자가 10만이에요.",
        narrator: "진료실 들어오자마자 스마트폰 렌즈를 들이댑니다.",
        image: "assets/p_vlogger.jpg",
        patientInfo: { age: 24, gender: 'F', bp: "120/80", hr: 90, bt: 36.5, history: "SNS 중독" },
        choices: [
            { label: "녹음은 불법이라고 경고한다", effect: { revenue: 0, mental: -10, satisfaction: -50, adminRisk: 0 }, log: "환자가 '갑질 병원'이라며 커뮤니티에 글을 올렸습니다." },
            { label: "최대한 친절하게 비위만 맞춘다", effect: { revenue: 4000, mental: -20, satisfaction: 10, adminRisk: 0 }, log: "구독자들이 '원장님 착하시네' 댓글을 달아줬지만 멘탈이 갈렸습니다." },
            { label: "방송 출연료 달라고 농담한다", effect: { revenue: 4000, mental: -5, satisfaction: 5, adminRisk: 0 }, log: "분위기가 애매해졌지만 진료는 마쳤습니다." }
        ]
    },
    {
        id: "hangover_iv",
        text: "어제 회식해서 죽겠어요... 제일 비싼 수액 하나 놔주세요. 실비로.",
        narrator: "술 냄새가 진동합니다. 숙취 해소 목적입니다.",
        image: "assets/p_hangover.jpg",
        patientInfo: { age: 32, gender: 'M', bp: "140/90", hr: 100, bt: 37.0, history: "알코올성 간질환 의심" },
        choices: [
            { label: "원하는 대로 고가 수액(10만원) 처방", effect: { revenue: 100000, mental: 0, satisfaction: 20, adminRisk: 30 }, log: "매출 대박! 하지만 실비 심사에서 걸릴 수도..." },
            { label: "수액실 꽉 찼다고 거짓말한다", effect: { revenue: 4000, mental: 0, satisfaction: -10, adminRisk: 0 }, log: "다른 병원 가겠다며 나갔습니다." },
            { label: "콩나물국밥 드시라고 조언한다", effect: { revenue: 0, mental: 5, satisfaction: -30, adminRisk: 0 }, log: "환자가 욕을 하며 나갔습니다." }
        ]
    },
    {
        id: "fake_holiday",
        text: "저기, 제가 내일부터 휴가여서 그런데... 3일치 입원 확인서 좀...",
        narrator: "하와이안 셔츠를 입고 있습니다. 누가 봐도 꾀병입니다.",
        image: "assets/p_hawaiian.jpg",
        patientInfo: { age: 48, gender: 'M', bp: "120/80", hr: 70, bt: 36.5, history: "건강함" },
        choices: [
            { label: "허위 진단서 발급 (30만원)", effect: { revenue: 300000, mental: 10, satisfaction: 100, adminRisk: 80 }, log: "유혹을 못 이기고 발급했습니다. 걸리면 면허 정지입니다." },
            { label: "절대 안 된다고 쫓아낸다", effect: { revenue: 0, mental: 0, satisfaction: -50, adminRisk: 0 }, log: "당연한 처사입니다." },
            { label: "휴식을 권고하는 소견서만 써준다", effect: { revenue: 10000, mental: -5, satisfaction: 10, adminRisk: 0 }, log: "타협했습니다." }
        ]
    },
    // from chars_set_2.jpg (3x3 Grid)
    {
        id: "couple_checkup",
        text: "영감 진료 보는 김에 나도 좀 봐줘요. 허리가 쑤셔서...",
        narrator: "접수는 한 명만 했습니다. 1+1 진료를 요구합니다.",
        image: "assets/p_couple.jpg",
        patientInfo: { age: 72, gender: 'F', bp: "130/80", hr: 75, bt: 36.6, history: "만성 통증" },
        choices: [
            { label: "두 분 다 꼼꼼히 봐드린다", effect: { revenue: 4000, mental: -15, satisfaction: 30, adminRisk: 0 }, log: "시간이 두 배로 걸렸습니다." },
            { label: "접수 먼저 하고 오시라고 한다", effect: { revenue: 8000, mental: -5, satisfaction: -10, adminRisk: 0 }, log: "정당한 수익을 챙겼습니다." },
            { label: "지금은 접수된 분만 봅니다", effect: { revenue: 4000, mental: 0, satisfaction: -30, adminRisk: 0 }, log: "매정한 의사라고 소문이 날 겁니다." }
        ]
    },
    {
        id: "internet_mom",
        text: "선생님, 이 약은 부작용이 많다던데 빼주세요. 제가 유튜브에서 공부했거든요.",
        narrator: "유튜브 영상을 보여주며 항변합니다.",
        image: "assets/p_mom.jpg",
        patientInfo: { age: 31, gender: 'F', bp: "120/80", hr: 80, bt: 37.2, history: "유튜브 맹신" },
        choices: [
            { label: "어머니 말씀대로 빼드린다", effect: { revenue: 3000, mental: -10, satisfaction: 20, adminRisk: 5 }, log: "엄마의 마음은 편해졌습니다." },
            { label: "전문가는 저라고 강하게 말한다", effect: { revenue: 3000, mental: -5, satisfaction: -40, adminRisk: 0 }, log: "맘카페에 불친절 후기가 올라올 것입니다." },
            { label: "왜 그 약이 필요한지 30분 설명한다", effect: { revenue: 3000, mental: -20, satisfaction: 10, adminRisk: 0 }, log: "설득은 했지만 진이 다 빠졌습니다." }
        ]
    },
    {
        id: "gym_pain",
        text: "어제 운동하다 가슴이 뻐근해서 왔어요. 파스나 주세요.",
        narrator: "식은땀을 흘리고 있습니다. 심각해 보입니다.",
        image: "assets/p_gym.jpg",
        patientInfo: { age: 29, gender: 'M', bp: "150/95", hr: 110, bt: 36.8, history: "흡연자/고지혈증" },
        choices: [
            { label: "파스 처방해주고 보낸다", effect: { revenue: 4000, mental: 0, satisfaction: 10, adminRisk: 50 }, log: "환자는 그날 밤 응급실에 실려갔습니다." },
            { label: "심전도 검사를 강력 권유한다", effect: { revenue: 15000, mental: -5, satisfaction: -10, adminRisk: 0 }, log: "심근경색 초기 발견! 생명을 구했습니다." },
            { label: "근이완제 주사를 놔준다", effect: { revenue: 8000, mental: 0, satisfaction: 10, adminRisk: 30 }, log: "통증만 가렸습니다. 위험합니다." }
        ]
    },
    {
        id: "drug_requester",
        text: "졸피뎀 좀 넉넉하게 주세요. 잠이 안 와서 미치겠어.",
        narrator: "불안한 표정으로 약물 처방을 종용합니다.",
        image: "assets/p_drug.jpg",
        patientInfo: { age: 35, gender: 'M', bp: "110/70", hr: 85, bt: 36.5, history: "약물 의존 의심" },
        choices: [
            { label: "규정대로만 준다", effect: { revenue: 5000, mental: -10, satisfaction: -10, adminRisk: 5 }, log: "환자가 투덜거립니다." },
            { label: "단호하게 거절한다", effect: { revenue: 0, mental: -5, satisfaction: -40, adminRisk: 0 }, log: "욕설을 퍼부으며 나갔습니다." },
            { label: "원하는 대로 다 준다", effect: { revenue: 15000, mental: 0, satisfaction: 40, adminRisk: 50 }, log: "수익은 냈지만 행정 리스크가 폭발했습니다." }
        ]
    },
    {
        id: "queue_rage",
        text: "아니 대기 30분째인데 언제 불러요! 나 바쁜 사람이야!",
        narrator: "진료실 문을 벌컥 열고 들어왔습니다. 매우 화가 나 있습니다.",
        image: "assets/p_angry_man.jpg",
        patientInfo: { age: 52, gender: 'M', bp: "160/100", hr: 120, bt: 37.0, history: "분노조절장애" },
        choices: [
            { label: "일단 사과하고 먼저 봐준다", effect: { revenue: 4000, mental: -20, satisfaction: 10, adminRisk: 0 }, log: "다른 대기 환자들이 항의하기 시작합니다." },
            { label: "나가서 기다리라고 소리친다", effect: { revenue: 0, mental: -5, satisfaction: -50, adminRisk: 0 }, log: "환자와 멱살잡이 직전까지 갔습니다." },
            { label: "간호사에게 방어템(진정)을 요청한다", effect: { revenue: 4000, mental: -10, satisfaction: -10, adminRisk: 0 }, log: "겨우 진정시켜 보냈습니다." }
        ]
    },
    {
        id: "old_man_fever",
        text: "콜록... 열이 좀 나는 것 같은데... 기력이 하나도 없어요.",
        narrator: "정말 아파 보입니다. 폐렴이 의심되는 노인 환자입니다.",
        image: "assets/p_old_man.jpg",
        patientInfo: { age: 78, gender: 'M', bp: "110/70", hr: 105, bt: 38.5, history: "만성 폐질환" },
        choices: [
            { label: "영양제 수액 놔드리고 보낸다", effect: { revenue: 50000, mental: 0, satisfaction: 20, adminRisk: 20 }, log: "수익은 냈지만, 밤새 악화될까 걱정입니다." },
            { label: "정밀 검사 후 입원을 권유한다", effect: { revenue: 30000, mental: -5, satisfaction: 10, adminRisk: 0 }, log: "적절한 조치를 취했습니다." },
            { label: "독감 검사부터 해본다", effect: { revenue: 30000, mental: 0, satisfaction: 5, adminRisk: 0 }, log: "A형 독감 확진!" }
        ]
    },
    {
        id: "mirror_self",
        text: "거울 속의 내가 묻는다. '너... 괜찮니?'",
        narrator: "거울 속 내 모습이 말이 아닙니다.",
        image: "assets/p_doctor_stressed.jpg",
        patientInfo: { bp: "???", hr: "???", bt: "36.5", history: "번아웃 위기" },
        choices: [
            { label: "찬물 세수하고 정신 차린다", effect: { revenue: 0, mental: 10, satisfaction: 0, adminRisk: 0 }, log: "다시 진료실로 향합니다." },
            { label: "비상금으로 초콜릿을 사 먹는다", effect: { revenue: -2000, mental: 20, satisfaction: 0, adminRisk: 0 }, log: "당 충전 완료!" },
            { label: "그냥 주저앉아 운다", effect: { revenue: 0, mental: -10, satisfaction: 0, adminRisk: 0 }, log: "조금은 후련합니다." }
        ]
    }
];

const endings = {
    burnout: {
        title: "번아웃 (Burnout)",
        desc: "더 이상 환자를 볼 체력도, 멘탈도 남지 않았습니다. 당신은 진료실 문을 잠그고 퇴근해버렸습니다.",
        color: "#57606f"
    },
    lawsuit: {
        title: "소송/민원 엔딩",
        desc: "보건소 민원과 심평원 감사가 동시에 들이닥쳤습니다. 면허 정지를 걱정해야 할 판입니다.",
        color: "#d63031"
    },
    survival: {
        title: "생존 (Survival)",
        desc: "무사히(간신히) 하루를 마쳤습니다. 하지만 내일도 똑같은 하루가 기다리고 있습니다.",
        color: "#00b894"
    }
};
