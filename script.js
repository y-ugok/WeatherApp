"use strict";

PetiteVue.createApp({
  data: {},
  lang: "ja",
  lat: "",
  lng: "",

  cityname: "Osaka",
  areaobj: "",
  getIconUrl(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}.png`;
  },
  async getProgramList() {
    const query = new URLSearchParams({
      func: "forecast",
      q: this.cityname,
    });
    const res = await fetch("https://weatherforecast-app.deno.dev/?" + query);
    
    const data = await res.json();
    console.log(JSON.stringify(data), null, 2);
    //JSON.stringifyメソッドはJavaScriptのオブジェクトをJSON形式の文字列に変換する用途で使われる

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => this.successFunc(position),
        this.errorFunc,
        this.optionObj
      );
    }

    //5日分の天気のAPIのデータをdataに渡した後に通常のオブジェクトに直す
    this.data = {};
    for (const d of data.list) {
      const date = d.dt_txt.split(" ");
      const val = {};

      val.time = date[1]; //06:00:00とかの部分だけ取得

      const shorttime = val.time.split(":");
      val.shorttime = `${shorttime[0]}:
      ${shorttime[1]}～`;
      val.desc = d.weather[0].description; //曇りがちとか天気に対するコメント
      val.temp = d.main.temp;
      val.icon = d.weather[0].icon;
      val.main = d.weather[0].main;
      val.humid = d.main.humidity;
      if (
        this.data[date[0]] == undefined
        //その日付のキーがthis.data内に存在しない時
      )
        this.data[date[0]] = [];
      //新しい日付のキーthis.data[0]をthis.dataオブジェクトに作成する
      this.data[date[0]].push(val);
    }
    console.log(JSON.stringify(this.data), null, 4);
    // データを取得した後に表示を切り替える（遅延ロードの例）
    setTimeout(() => {
      document.getElementById("data1").style.display = "block";
    }, 200);

    setTimeout(() => {
      document.getElementById("weatherData").style.display = "block";
    }, 200);
  },

  formatTempl(idx) {
    const kelvinTemperature = idx;
    const celsiusTemperature = kelvinTemperature - 273.15;
    return Math.round(celsiusTemperature) + "℃";
    //引数として与えられた数を四捨五入
  },

  formatDateWithDay(date) {
    const daysOfWeek = ["日", "月", "火", "水", "木", "金", "土"];

    const formattedDate = new Date(date);
    const dayIndex = formattedDate.getDay();
    const dayOfWeek = daysOfWeek[dayIndex];

    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const formattedDateString = formattedDate.toLocaleDateString(
      "ja-JP",
      options
    );

    return `${formattedDateString}(${dayOfWeek})`;
  },
  formatRelativeDate(date) {
    const today = new Date();
    const targetDate = new Date(date);
    const timeDiff = targetDate - today;
    //2つの日付の間の時間差(ミリ秒単位)が計算される
    const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    //1日のミリ秒を日付に変換する
    if (dayDiff === -1) {
      return "昨日";
    } else if (dayDiff === 0) {
      return "今日";
    } else if (dayDiff === 1) {
      return "明日";
    } else if (dayDiff === 2) {
      return "明後日";
    } else if (dayDiff > 2) {
      return `${dayDiff}日後`;
    } else {
      return ""; // 過去の日付の場合は空白を返すなど、適切な処理を行う
    }
  },

  async successFunc(position) {
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;
    this.accuracy = position.coords.accuracy;
    console.log(this.latitude, this.longitude);
    const weather = "weather"; // 任意の値を設定するか、必要なAPIの関数名を設定する
    const query = new URLSearchParams({
      func: weather,
      lat: this.latitude,
      lon: this.longitude,
    });

    const res = await fetch(
      "https://weatherforecast-app.deno.dev/?" + query
    );
    this.areaobj = await res.json();
  },
  errorFunc(error) {
    console.log("Error getting geolocation:", error);
  },
  optionObj() {
    console.log("Option object for geolocation.");
  },
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  },
}).mount();
