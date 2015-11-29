/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

 window.onload = function () {

    var accelera1=0;
    var accelera2=0;
    var accelera3=0;
    var comp=0;
    var prox;
    var li;
    var devicedata = function(){
        navigator.compass.getCurrentHeading(compassSuccess, compassError);
        navigator.accelerometer.getCurrentAcceleration(accelerometerSuccess, accelerometerError);
        navigator.proximity.getProximityState(proximitySuccess);
        window.light = cordova.require("cordova-plugin-lightSensor.light");
        light.getLightState(lightSuccess);
    };
    var accelerometerSuccess = function(acceleration) {
        accelera1 = acceleration.x;
        accelera2 = acceleration.y;
        accelera3 = acceleration.z;
        $('#viewacceleration').html("x軸：" + acceleration.x + "<br>" + "y軸：" + acceleration.y + "<br>" + "z軸：" + acceleration.z + "<br>");
    };

    var accelerometerError = function(e) {
        alert(e);
    };

    var compassSuccess = function(compass) {
        comp = compass.magneticHeading;
        $("#compass").html("方角：" + compass.magneticHeading + "<br>");
    };

    var compassError = function(e) {
        alert(e);
    };

    var proximitySuccess = function(proximity) {
        var prox = proximity;
        $("#proximity").html("接近値：" + proximity);
    };

    var lightSuccess = function(light) {
        var li = light;
        $("#light").html("輝度：" + light);
    };

    var options = {
        frequency: 1000
    };
    

    //サウンド部分
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    var audioContext = new AudioContext();
    var note = {};
    ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'].forEach(function(v, i){
        note[v] = i;
    });
    var play = function(noteId){
        var osciillatorNode = audioContext.createOscillator();
        if (comp < 90) {
            osciillatorNode.type = 'sine';
        } else if (comp < 180) {
            osciillatorNode.type = 'square';
        } else if(comp < 270) {
            osciillatorNode.type = 'sawtooth';
        } else{
            osciillatorNode.type = 'triangle';
        }
        osciillatorNode.start = osciillatorNode.start || osciillatorNode.noteOn;
     
        //音程を設定
        var frequency = parseInt(440 * Math.pow(Math.pow(2,1/12), (3-12) + note[noteId]), 10);
        osciillatorNode.frequency.value = frequency;
     
        //音量を少しづつ下げ音色をソフトにする
        var gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0, play.count);
        gainNode.gain.linearRampToValueAtTime(1.0, play.count + 0.01);
        gainNode.gain.linearRampToValueAtTime(0.7, play.count + 0.20);
        gainNode.gain.linearRampToValueAtTime(0.4, play.count + 0.40);
        gainNode.gain.linearRampToValueAtTime(0.0, play.count + 0.80);
     
        //接続（発生源 → 加工）
        osciillatorNode.connect(gainNode);
     
        //接続（加工 → 出力）
        gainNode.connect(audioContext.destination);
     
        //再生開始時間を指定する
        osciillatorNode.start(play.count || 0);
        
        play.count = play.count + 0.5;
        return play;
    };
    play.count = 0;
    setInterval(function(){
        navigator.compass.getCurrentHeading(compassSuccess, compassError);
        navigator.accelerometer.getCurrentAcceleration(accelerometerSuccess, accelerometerError);
        var d1 = new Date().getTime();
        var d2 = new Date().getTime();
        function sleep(time, callback){

            setTimeout(callback, time);

        }
        sleep(100, function (){
            if(accelera1 < 0 && accelera2 < 0 && accelera3 <= 10){
                play('D');
            }else if(accelera1 <= 2 && accelera2 <= 2 && accelera3 <=10){
                play('C');
            } else if(accelera1 <=2){
                play('Db');
            } else if(accelera2 <=2){
                play('Eb');
            } else if(accelera3 <= 10) {
                play('E');
            } else {
                play('F');
            }
        });
        
    }, 400);
};