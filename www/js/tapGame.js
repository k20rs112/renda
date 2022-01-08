//
//  tapGame.js
//  MonacaFirstApp
//
//  Created by Natsumo Ikeda on 2016/07/01.
//  Copyright 2017 FUJITSU CLOUD TECHNOLOGIES LIMITED All Rights Reserved.
//

/******************************************************/

/******************************************************/

// mBaaSの初期化
var ncmb = new NCMB(this.APPLICATION_KEY, this.CLIENT_KEY);
// タイマー設定
var countTimer = 63;
// タップ回数カウンター
var counter = 0;
// 「tapFlag」的のタップ可否設定
var tapFlag = false;
//目標タップ数
var mokuhyou = 0;
//目標の入力
function enterData() {
      let uTdata = new UTdata();
      let value = parseInt($("#data").val());
      uTdata.set(key, value)
        .save()
        .then(function(results) {
          $("#display").removeClass();
          $("#display").addClass("bg-success");
          $("#display").html("enter success");
        })
        .catch(function(results) {
          $("#display").removeClass();
          $("#display").addClass("bg-warning");
          $("#display").html("enter fail");
        })
    }
// 「Start」ボタン押下時の処理
function startGame() {
  // ボタンの無効化
  document.gameForm.start.disabled = true;
  document.gameForm.ranking.disabled = true;

  // タップカウンターリセット
  this.counter = 0;
  $("#list-page strong").html(String(0));
  // タイマーリセット
  this.countTimer = 63;
  // タイマーを起動
  countTime(countTimer);
}

// 【mBaaS】データの保存
function saveScore(name, score) {
  // **********【問題１】名前とスコアを保存しよう！**********
  // 保存先クラスを作成
  var GameScore = ncmb.DataStore("GameScore");
  // クラスインスタンスを生成
  var gameScore = new GameScore();
  // 値を設定
  gameScore.set("name", name);
  gameScore.set("score", score);
  // 保存を実施
  gameScore.save()
    .then(function () {
      // 保存に成功した場合の処理
      console.log("保存に成功しました。");
    })
    .catch(function (error) {
      // 保存に失敗した場合の処理
      console.log("保存に失敗しました。エラー:" + error);
    });
  // ********************************************************
}

// タイマー
function countTime(time) {
  if (time > 0) {
    if (time >= 61) {
      this.tapFlag = false;
      $("#list-page p").html(String(time - 60));
    } else if (time == 60) {
      this.tapFlag = true;
      $("#list-page p").html("スタート！");
    } else {
      this.tapFlag = true;
      $("#list-page p").html(String(time));
    }
    this.countTimer -= 1;
    // １秒後にcountTime()を呼び出す
    setTimeout("countTime(countTimer)", 1000);
  } else {
    this.tapFlag = false;
    $("#list-page p").html("タイムアップ！");
    imputName(this.counter);
  }
}

// 名前入力アラートの表示
function imputName(count) {
  // 入力アラートを表示
  var name = window.prompt("調査場所を入力してください", "");
  if (name == null || name == "") {
    $("#list-page p").html("保存がキャンセルされました");
  } else {
    // スコアと入力した名前を保存
    saveScore(name, count);
    $("#list-page p").html(name + "の交通量は" + String(count) + "台でした");
  }
  // ボタンの有効化
  document.gameForm.start.disabled = false;
  document.gameForm.ranking.disabled = false;
}

// タップ数カウント
function tapCount() {
  if (tapFlag) {
    this.counter += 1;
    $("#list-page strong").html(String(this.counter));
  }
}
