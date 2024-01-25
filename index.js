console.log('Lets write JavaScript');
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    // Calculate minutes and remaining seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;

    // Format the result with leading zeros
    var formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    var formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    // Combine minutes and seconds with the specified format
    var formattedTime = formattedMinutes + ':' + formattedSeconds;

    return formattedTime;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    
           //Show all the songs in the playlist
           let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
           songUL.innerHTML = ""
           for (const song of songs) {
               songUL.innerHTML = songUL.innerHTML + `<li><svg class="invert" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                       xmlns="http://www.w3.org/2000/svg">
                                       <circle cx="6.5" cy="18.5" r="3.5" stroke="#141B34" stroke-width="1.5" />
                                       <circle cx="18" cy="16" r="3" stroke="#141B34" stroke-width="1.5" />
                                       <path
                                           d="M10 18.5L10 7C10 6.07655 10 5.61483 10.2635 5.32794C10.5269 5.04106 11.0175 4.9992 11.9986 4.91549C16.022 4.57222 18.909 3.26005 20.3553 2.40978C20.6508 2.236 20.7986 2.14912 20.8993 2.20672C21 2.26432 21 2.4315 21 2.76587V16"
                                           stroke="#141B34" stroke-width="1.5" stroke-linecap="round"
                                           stroke-linejoin="round" />
                                       <path d="M10 10C15.8667 10 19.7778 7.66667 21 7" stroke="#141B34" stroke-width="1.5"
                                           stroke-linecap="round" stroke-linejoin="round" />
                                   </svg>
                                   <div class="info">
                                       <div>${song.replaceAll("%20", " ")}</div>
                                       
                                   </div>
                                   <div class="playnow">
                                       <span>Play Now</span>
       
       
                                       <svg class="invert" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                           xmlns="http://www.w3.org/2000/svg">
                                           <circle cx="12" cy="12" r="10" stroke="#141B34" stroke-width="1.5" />
                                           <path
                                               d="M15.4531 12.3948C15.3016 13.0215 14.5857 13.4644 13.1539 14.3502C11.7697 15.2064 11.0777 15.6346 10.5199 15.4625C10.2893 15.3913 10.0793 15.2562 9.90982 15.07C9.5 14.6198 9.5 13.7465 9.5 12C9.5 10.2535 9.5 9.38018 9.90982 8.92995C10.0793 8.74381 10.2893 8.60868 10.5199 8.53753C11.0777 8.36544 11.7697 8.79357 13.1539 9.64983C14.5857 10.5356 15.3016 10.9785 15.4531 11.6052C15.5156 11.8639 15.5156 12.1361 15.4531 12.3948Z"
                                               stroke="#141B34" stroke-width="1.5" stroke-linejoin="round" />
                                       </svg>
                                   </div></li>`;
           }
       
           //Attach an event listner to each song
           Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
               e.addEventListener("click", element => {
                   console.log(e.querySelector(".info").firstElementChild.innerHTML)
                   playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
               })
           })
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        // play.src = "pause.svg"
    }  

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"



}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            
        }
        if(e.target.href.includes("/songs/")){
            let folder = (e.href.split("/").slice(-2)[0])

             // Get the metadata of the folder
             let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json `)
             let response = await a.json();
             console.log(response)
             cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
             <div class="play">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  xmlns="http:// www.w3.org/2000/svg">
                  <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                      stroke-linejoin="round" />
              </svg>
          </div>
          <img src="/songs/${folder}/singer.jpg" alt="Singer image">  
          <h2>${response.title}</h2>
          <p>${response.description}</p>
      </div>`

        }
    }


    //Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        console.log(e)
        e.addEventListener("click", async item=>{
            songs = await getSongs(`songs/${ item.currentTarget.dataset.folder}`)
        })
    })



async function main() {
    //Get the list of all the songs 
    await getSongs("songs/music")
    playMusic(songs[0]) //,true

    // Display all the albums on the paage
    displayAlbums()

    //Attach an event listner to play, previous and next song
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            // play.src = "<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            // <path d="M4 7C4 5.58579 4 4.87868 4.43934 4.43934C4.87868 4 5.58579 4 7 4C8.41421 4 9.12132 4 9.56066 4.43934C10 4.87868 10 5.58579 10 7V17C10 18.4142 10 19.1213 9.56066 19.5607C9.12132 20 8.41421 20 7 20C5.58579 20 4.87868 20 4.43934 19.5607C4 19.1213 4 18.4142 4 17V7Z" stroke="#141B34" stroke-width="1.5"/>
            // <path d="M14 7C14 5.58579 14 4.87868 14.4393 4.43934C14.8787 4 15.5858 4 17 4C18.4142 4 19.1213 4 19.5607 4.43934C20 4.87868 20 5.58579 20 7V17C20 18.4142 20 19.1213 19.5607 19.5607C19.1213 20 18.4142 20 17 20C15.5858 20 14.8787 20 14.4393 19.5607C14 19.1213 14 18.4142 14 17V7Z" stroke="#141B34" stroke-width="1.5"/>
            // </svg>"
        }
        else {
            currentSong.pause()
            // pause.src = "<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            // <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round"/>
            // </svg>"
        }
    })

    //Listen for timeupdate event
    function secondsToMinutesSeconds(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    currentSong.addEventListener("timeupdate", () => {
        const currentTime = currentSong.currentTime;
        const duration = currentSong.duration;

        console.log(currentTime, duration);

        const formattedCurrentTime = secondsToMinutesSeconds(currentTime);
        const formattedDuration = secondsToMinutesSeconds(duration);

        document.querySelector(".songtime").innerHTML = `${formattedCurrentTime}/${formattedDuration}`;

        const progressPercentage = (currentTime / duration) * 100;
        const formattedPercentage = progressPercentage.toFixed(2); // Limit to 2 decimal places

        document.querySelector(".circle").style.left = `${formattedPercentage}%`;
    });



    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    //Add an event listner for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    //Add an event listner for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-125%"
    })

    //Add and event listner to previous and next
    previous.addEventListener("click", () => {
        console.log("Previous Clicked")
        console.log(currentSong)
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    next.addEventListener("click", () => {
        console.log("Next Clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }

    })

    //Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        console.log(e, e.target, e.target.value)
        currentSong.volume = parseInt(e.target.value)/100
    })

}

main()
