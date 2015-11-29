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


    var devicedata = function(){
        navigator.accelerometer.getCurrentAcceleration(accelerometerSuccess, accelerometerError);
        navigator.compass.getCurrentHeading(compassSuccess, compassError);
        navigator.proximity.getProximityState(proximitySuccess);
        window.light = cordova.require("cordova-plugin-lightSensor.light");
        light.getLightState(lightSuccess);
    };
    var accelerometerSuccess = function(acceleration) {
        $('#viewacceleration').html("x軸：" + acceleration.x + "<br>" + "y軸：" + acceleration.y + "<br>" + "z軸：" + acceleration.z + "<br>");
    };

    var accelerometerError = function(e) {
        alert(e);
    };

    var compassSuccess = function(compass) {
        $("#compass").html("方角：" + compass.magneticHeading + "<br>");
    };

    var compassError = function(e) {
        alert(e);
    };

    var proximitySuccess = function(proximity) {
        $("#proximity").html("接近値：" + proximity);
    };

    var lightSuccess = function(light) {
        $("#light").html("輝度：" + light);
    };

    var options = {
        frequency: 1000
    };

    $(document).on("click", ".app", function() {
        devicedata();
    });

    //サウンド部分
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    var audioContext = new AudioContext();
    var note = {};
    ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'].forEach(function(v, i){
        note[v] = i;
    });
    var play = function(noteId){
        var osciillatorNode = audioContext.createOscillator();
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
     
        play.count = play.count + 2;
        return play;
    };
    play.count = 0;
     
    //ドレミファソファミレド
    play('C')('D')('E')('F')('G')('F')('E')('D')('C');
    
};