import { useState } from"react";
import "./App.css";

function App() {
  const [question,setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [submittedQuestion, setSubmittedQuestion] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("レジ");
  const sendQuestion = async () => {
    if (question.trim() === "") {
      setAnswer("質問を入力してください。");
      return;
    }

    setSubmittedQuestion(question);
    setAnswer("通信中...");

    try {
      const response = await fetch("http://127.0.0.1:8000/ask", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question,
      })
    });

    if (!response.ok) {
      throw new Error('通信エラー: ${response.status');
    }

    const data = await response.json();
    setAnswer(data.answer);
  } catch (error) {
    console.error(error);
    setAnswer("バックエンドとの通信に失敗しました。");
  }
};
  function createAnswer(text) {
    if (text.includes("返品")){
      return "返品をご希望の場合は、レシートと商品をご確認ください。";
    }

    if (text.includes("レジ")) {
      return "商品読み込み後に支払方法を選択してください。";
    }

    if (text.includes("ポイント")) {
      return "ポイント利用時は、会員証を確認してから利用ポイント数を入力してください。";
    }

    return "申し訳ございません。該当する回答が見つかりませんでした。";
  }
  return (
    <div className="App">
      <h1>Store Assistant AI</h1>
      <p>新人教育サポートアプリ</p>

      <h2>カテゴリー</h2>

      <div className="category-list">
        <button onClick={() => setSelectedCategory("レジ")}>レジ</button>
        <button onClick={() => setSelectedCategory("在庫")}>在庫</button>
        <button onClick={() => setSelectedCategory("返品")}>返品</button>
        <button onClick={() => setSelectedCategory("接客")}>接客</button>
        <button onClick={() => setSelectedCategory("商品知識")}>商品知識</button>
      </div>

<h2>よくある質問</h2>

<div className="faq-list">

  {selectedCategory === "レジ" && (
    <>
      <button onClick={() => setQuestion("会計の基本手順を教えて")}>
        会計の基本手順
      </button>

      <button onClick={() => setQuestion("クレジットカード決済の方法を教えて")}>
        クレジットカード決済
      </button>

      <button onClick={() => setQuestion("電子マネー決済の方法を教えて")}>
        電子マネー決済
      </button>
    </>
  )}

  {selectedCategory === "在庫" && (
    <>
      <button onClick={() => setQuestion("在庫確認の方法を教えて")}>
        在庫確認
      </button>

      <button onClick={() => setQuestion("他店舗の在庫確認について教えて")}>
        他店舗在庫
      </button>
    </>
  )}

  {selectedCategory === "返品" && (
    <>
      <button onClick={() => setQuestion("返品対応の流れを教えて")}>
        返品対応
      </button>

      <button onClick={() => setQuestion("交換対応の流れを教えて")}>
        交換対応
      </button>
    </>
  )}

  {selectedCategory === "接客" && (
    <>
      <button onClick={() => setQuestion("接客の基本的な流れを教えて")}>
        接客の基本
      </button>

      <button onClick={() => setQuestion("お客様への声かけの方法を教えて")}>
        声かけ
      </button>

      <button onClick={() => setQuestion("クレーム対応について教えて")}>
        クレーム対応
      </button>
    </>
  )}

  {selectedCategory === "商品知識" && (
    <>
      <button onClick={() => setQuestion("GORE-TEXについて教えて")}>
        GORE-TEX
      </button>

      <button onClick={() => setQuestion("UKサイズについて教えて")}>
        UKサイズ
      </button>

      <button onClick={() => setQuestion("ダウンと化繊の違いを教えて")}>
        ダウン・化繊
      </button>

      <button onClick={() => setQuestion("防水と撥水の違いを教えて")}>
        防水・撥水
      </button>
    </>
  )}

</div>

      <h2>AIに質問する</h2>

      <div className="question-box">
        <input
          type="text"
          placeholder="質問を入力してください..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="質問を入力してください..."
        />
        <button onClick={sendQuestion}>
          送信
        </button>
    　</div>

    {submittedQuestion && (
      <div className="answer-area">
        <h3>あなたの質問</h3>
        <p>{submittedQuestion}</p>
      </div>
    )}

    {answer && (
      <div className="answer-area">
        <h3>AIの回答</h3>
        <p>{answer}</p>
      </div>
    )}
    </div>
  );
}

export default App;

