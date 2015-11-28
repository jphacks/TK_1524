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

    var options = {
        frequency: 1000
    };

    $(document).on("click", ".app", function() {
        devicedata();
    });
    
};