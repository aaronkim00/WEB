/**
 * IDEV Project 'WEBStudy' - Minesweeper
 * Copyright (c) 2021 김민우, 김예린, 이종현
 * All Rights Reserved
 *
 * minesweeper.js
 * minesweeper data processing core
 */

function OK(x, y, posX, posY) {
    return posX >= 0 && posX < x && posY >= 0 && posY < y;
}

function setMine(x, y, clickX, clickY) { //처음 클릭 시에 setMine 호출한 이후에 clicked도 호출해주세요
    let nMine = Math.max(parseInt(x*y/8), 4);
    let n=Math.max(parseInt(nMine/5), 1);
    nMine+=parseInt((Math.random()-0.5)*n)%n;       //nMine 값 랜덤으로 약간 바꾸기
    
    var arr = new Array(x);
    for (let i = 0; i < x; i++) {
        arr[i] = new Array(y);
    }
    for (let i = 0; i < x; i++) {
        for (var j = 0; j < y; j++) {
            arr[i][j] = -2;
        }
    }
    
    let dx=[1, 1, 1, 0, 0, 0, -1, -1, -1];
    let dy=[1, 0, -1, 1, 0, -1, 1, 0, -1];
    for(let i=0; i<9; i++){
        a=clickX+dx[i];
        b=clickY+dy[i];
        if(OK(x, y, a, b)){
            arr[a][b]=-1;
        }
    }
    
    for (let i = 0; i < nMine; i++) {
        let newX, newY;
        do {
            newX = parseInt(Math.random() * x) % x;
            newY = parseInt(Math.random() * y) % y;
        } while (arr[newX][newY] === -1);
        arr[newX][newY] = -1;
    }
    for(let i=0; i<9; i++){
        a=clickX+dx[i];
        b=clickY+dy[i];
        if(OK(x, y, a, b)){
            arr[a][b]=-2;
        }
    }
    processMine(x, y, clickX, clickY, arr, true);
    return arr;
}



function open(x, y, posX, posY, arr) {
    let dx = [1, 1, 1, 0, 0, -1, -1, -1];
    let dy = [1, 0, -1, 1, -1, 1, 0, -1];
    let cnt = 0

    arr[posX][posY] = -1.5; //무한루프를 막기 위해 엉뚱한 값으로 초기화시킴

    for (let i = 0; i < 8; i++) {
        let a = posX + dx[i];
        let b = posY + dy[i];
        if (OK(x, y, a, b)) {
            if (arr[a][b] === -1) { //지뢰 존재
                cnt += 1
            }
        }
    }
    if (cnt === 0) {
        for (let i = 0; i < 8; i++) {
            let a = posX + dx[i];
            let b = posY + dy[i];
            if (OK(x, y, a, b) && arr[a][b] === -2) {
                open(x, y, a, b, arr);
            }
        }
    }
    arr[posX][posY] = cnt;
}

function processMine(x, y, clickX, clickY, arr, flagarr, clicked) {
    switch (arr[clickX][clickY]) {
        case -2: //not mine
            console.log('nm');
            open(x, y, clickX, clickY, arr);
            break;
        case -1: //mine
            console.log('m');
            arr[clickX][clickY] = -3;
            break;
        default:
            console.log('def');
            if(!clicked){
                break;
            }
            let dx=[1, 0, -1, 1, -1, 1, 0, -1];
            let dy=[1, 1, 1, 0, 0, -1, -1, -1];
            let cnt=0;
            for (let i=0; i<8; i++){
                let a=clickX+dx[i];
                let b=clickY+dy[i];
                if(OK(x, y, a, b) && flagarr[a][b]){
                    cnt+=1;
                }
            }
            if(cnt===arr[clickX][clickY]){
                for(let i=0; i<8; i++){
                    let a=clickX+dx[i];
                    let b=clickY+dy[i];
                    if(OK(x, y, a, b) && !flagarr[a][b]){
                        processMine(x, y, a, b, arr, flagarr, false);
                    }
                }
            }
            break;
    }
}

function flagMine(x, y, clickX, clickY, arr) {
    arr[clickX][clickY] = 1 - arr[clickX][clickY];
}

function setMap(x, y) {
    let arr = new Array(x);
    for (let i = 0; i < x; i++) {
        arr[i] = new Array(y);
    }
    for (let i = 0; i < x; i++) {
        for (let j = 0; j < y; j++) {
            arr[i][j] = 0;
        }
    }
    return arr;
}

function showMine(x, y, arr) {
    for (let i = 0; i < x; i++) {
        for (let j = 0; j < y; j++) {
            if (arr[i][j] === -1) {
                arr[i][j] = -3;
            }
        }
    }
}