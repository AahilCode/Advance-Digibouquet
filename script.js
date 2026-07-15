const SUPABASE_URL = "https://efnsfsernvtgkyipkhse.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmbnNmc2VybnZ0Z2t5aXBraHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxMTg0MzMsImV4cCI6MjA5OTY5NDQzM30.87YK-88C0aX080NS4CUASsn4wLoXOUJ7ALMVSAWzMp4";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const paper = document.getElementById("paper");
const sidebarFlowers = document.querySelectorAll(".flower");

let selectedFlower = null;

sidebarFlowers.forEach(flower=>{

    flower.addEventListener("click",()=>{

        sidebarFlowers.forEach(f=>f.classList.remove("selected"));

        flower.classList.add("selected");

        selectedFlower = flower.src;

    });

});

// ---------- PLACE FLOWER ----------

paper.addEventListener("click",e=>{

    if(!selectedFlower) return;

    if(e.target.classList.contains("paper-flower")) return;

    const rect = paper.getBoundingClientRect();

    const flower = document.createElement("img");

    flower.src = selectedFlower;
    flower.className = "paper-flower";

    flower.style.left =
        (e.clientX-rect.left-60)+"px";

    flower.style.top =
        (e.clientY-rect.top-60)+"px";

    flower.style.transform=
        `rotate(${Math.random()*30-15}deg)`;

    paper.appendChild(flower);

    enableMove(flower);

});

// ---------- MOVE FLOWERS ----------

function enableMove(flower){

    let dragging=false;
    let offsetX=0;
    let offsetY=0;

    flower.addEventListener("mousedown",e=>{

        dragging=true;

        e.stopPropagation();

        const rect=flower.getBoundingClientRect();

        offsetX=e.clientX-rect.left;
        offsetY=e.clientY-rect.top;

    });

    document.addEventListener("mousemove",e=>{

        if(!dragging) return;

        const paperRect=paper.getBoundingClientRect();

        flower.style.left=
            (e.clientX-paperRect.left-offsetX)+"px";

        flower.style.top=
            (e.clientY-paperRect.top-offsetY)+"px";

    });

    document.addEventListener("mouseup",()=>{

        dragging=false;

    });

    flower.addEventListener("dblclick",()=>{

        flower.remove();

    });

}

// ---------- COPY LINK ----------

document.getElementById("copyBtn").addEventListener("click",async()=>{

    const letter=document.getElementById("letter").value;

    const hearts=
        parseInt(document.getElementById("heartCount").value)||0;

    const flowers=[];

    document.querySelectorAll(".paper-flower").forEach(f=>{

        flowers.push({

            image:f.src,
            left:f.style.left,
            top:f.style.top,
            rotation:f.style.transform

        });

    });

    const {data,error}=await db
    .from("bouquets")
    .insert([{

        letter,
        hearts,
        flowers

    }])
    .select()
    .single();

    if(error){

        console.error(error);

        alert("Couldn't save bouquet");

        return;

    }

    const link=
        window.location.origin+
        window.location.pathname+
        "?id="+
        data.id;

    await navigator.clipboard.writeText(link);

    const btn=document.getElementById("copyBtn");

    btn.textContent="✅ Link Copied!";

    setTimeout(()=>{

        btn.textContent="📋 Copy Link";

    },2000);

});

// ---------- DOWNLOAD ----------

document.getElementById("downloadBtn").addEventListener("click",()=>{

    alert("Coming soon 🚀");

});