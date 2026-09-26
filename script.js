const API = "https://equran.id/api/v2";

let suratData = [];
let ayatData = [];

let score = 0;
let currentAnswer = null;



const suratList = document.getElementById("suratList");
const status = document.getElementById("status");
const suratDetail = document.getElementById("suratDetail");
const quizBox = document.getElementById("quizBox");



// ==========================
// AMBIL DAFTAR SURAT
// ==========================

async function loadSurat(){

    try{

        status.innerHTML =
        "⏳ Memuat daftar surat...";


        let response =
        await fetch(`${API}/surat`);


        let result =
        await response.json();


        suratData =
        result.data;



        suratData.forEach(surat=>{


            let option =
            document.createElement("option");


            option.value =
            surat.nomor;


            option.textContent =
            `${surat.nomor}. ${surat.namaLatin}`;


            suratList.appendChild(option);


        });



        status.innerHTML =
        "✅ Silahkan pilih surat";


    }


    catch(error){

        status.innerHTML =
        "❌ Gagal mengambil data API";

    }


}



loadSurat();




// ==========================
// DETAIL SURAT
// ==========================


suratList.addEventListener(
"change",
loadSuratDetail
);



async function loadSuratDetail(){


    let nomor =
    suratList.value;



    if(!nomor)return;



    try{


        status.innerHTML =
        "⏳ Mengambil ayat...";



        let response =
        await fetch(`${API}/surat/${nomor}`);



        let result =
        await response.json();



        ayatData =
        result.data.ayat;



        let html = `


        <div class="card">

        <h2>
        ${result.data.namaLatin}
        </h2>


        <p>
        Jumlah ayat :
        ${result.data.jumlahAyat}
        </p>


        </div>


        `;




        ayatData.forEach(ayat=>{


            html += `


            <div class="ayat">


            <h3>
            Ayat ${ayat.nomorAyat}
            </h3>



            <p class="arab">

            ${ayat.teksArab}

            </p>



            <p>

            ${ayat.teksIndonesia ?? ""}

            </p>


            </div>



            `;


        });



        suratDetail.innerHTML =
        html;



        status.innerHTML =
        "✅ Surat siap digunakan";



        quizBox.innerHTML =
        `
        <p>
        Pilih mode murajaah lalu tekan Soal Berikutnya
        </p>
        `;


        resetQuiz();


    }


    catch(error){

        status.innerHTML =
        "❌ API gagal dibuka";

    }



}





// ==========================
// MENU
// ==========================


function showMenu(menu){


    document
    .querySelectorAll(".container")
    .forEach(item=>{

        item.classList.add("hidden");

    });



    document
    .getElementById(menu)
    .classList.remove("hidden");


}






// ==========================
// MULAI SOAL
// ==========================


function nextQuestion(){



    if(ayatData.length < 4){


        quizBox.innerHTML =
        `

        <div class="ayat">

        ⚠️ Ayat terlalu sedikit.
        Pilih surat lain.

        </div>

        `;


        return;


    }



    let mode =
    document.getElementById("mode").value;



    if(mode==="tebak"){


        tebakAyat();


    }

    else{


        sambungAyat();


    }


}





// ==========================
// TEBAK AYAT
// ==========================


function tebakAyat(){


    let index =
    random(0,ayatData.length-1);



    let ayat =
    ayatData[index];



    currentAnswer =
    ayat.nomorAyat;



    let pilihan =
    buatNomorPalsu(
        ayat.nomorAyat
    );



    quizBox.innerHTML =


    `

    <div class="ayat">


    <h3>
    Ayat ini nomor berapa?
    </h3>


    <p class="arab">

    ${ayat.teksArab}

    </p>



    ${pilihan.map(n=>`


    <button
    class="pilihan"
    onclick="cekNomor(${n},this)">

    Ayat ${n}

    </button>


    `).join("")}


    </div>


    `;



}





// ==========================
// SAMBUNG AYAT
// ==========================


function sambungAyat(){


    let index =
    random(0,ayatData.length-2);



    let benar =
    ayatData[index+1].teksArab;



    currentAnswer =
    benar;



    let pilihan =
    buatTextPalsu(benar);




    quizBox.innerHTML =



    `

    <div class="ayat">


    <h3>
    Pilih sambungan ayat berikutnya
    </h3>



    <p class="arab">

    ${ayatData[index].teksArab}

    </p>



    ${pilihan.map(text=>`


    <button

    class="pilihan arab"

    onclick="cekText('${encodeURIComponent(text)}',this)">


    ${text}


    </button>


    `).join("")}



    </div>



    `;



}






// ==========================
// BUAT PENGEC0H
// ==========================


function buatNomorPalsu(benar){


    let array =
    [benar];


    while(array.length<3){


        let angka =
        random(1,ayatData.length);



        if(!array.includes(angka)){


            array.push(angka);

        }


    }


    return acak(array);


}





function buatTextPalsu(benar){


    let array =
    [benar];


    while(array.length<3){


        let ayat =

        ayatData[
        random(0,ayatData.length-1)
        ].teksArab;



        if(!array.includes(ayat)){


            array.push(ayat);

        }


    }


    return acak(array);


}





// ==========================
// CEK JAWABAN
// ==========================


function cekNomor(jawab,tombol){


    if(jawab===currentAnswer){


        tombol.classList.add("benar");

        score+=10;


    }

    else{


        tombol.classList.add("salah");


    }


    kunci();

    updateScore();


}





function cekText(text,tombol){


    let jawab =
    decodeURIComponent(text);



    if(jawab===currentAnswer){


        tombol.classList.add("benar");

        score+=10;


    }


    else{


        tombol.classList.add("salah");


    }


    kunci();

    updateScore();



}







function kunci(){


    document
    .querySelectorAll(".pilihan")
    .forEach(btn=>{


        btn.disabled=true;


    });


}




function updateScore(){


    document.getElementById("score")
    .innerHTML =

    `🏆 Skor : ${score}`;


}




function restartQuiz(){


    score=0;

    updateScore();

    nextQuestion();


}



function resetQuiz(){


    score=0;

    updateScore();


}




function random(min,max){


    return Math.floor(
    Math.random()*(max-min+1)+min
    );


}



function acak(arr){


    return arr.sort(
    ()=>Math.random()-0.5
    );


}
function openQuran(){


let book =
document.querySelector(".mushaf");


book.classList.add("open");



setTimeout(()=>{


document
.getElementById("dashboard")
.style.display="none";



showMenu("quran");



},1000);



}