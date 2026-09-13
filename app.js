const branches = {

  kyiv:{
    name:"Київ",
    phone:"+380982232242",
    label:"+380 98 223 22 42",
    address:"м. Київ, вул. Велика Окружна, 4Г",
    map:"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent("Київ Велика Окружна 4Г")
  },

  lviv:{
    name:"Львів",
    phone:"+380970294949",
    label:"+380 97 029 49 49",
    address:"Солонка, вул. Промислова, 13, Львівська область",
    map:"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent("Солонка Промислова 13 Львівська область")
  },

  kharkiv:{
    name:"Харків",
    phone:"+380734054000",
    label:"+380 73 405 40 00",
    address:"м. Харків, вул. Чугуївська, 78",
    map:"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent("Харків Чугуївська 78")
  },

  dnipro:{
    name:"Дніпро",
    phone:"+380970402040",
    label:"+380 97 040 20 40",
    address:"м. Дніпро, вул. Енергетична, 18К",
    map:"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent("Дніпро Енергетична 18К")
  },

  odesa:{
    name:"Одеса",
    phones:[
      ["+380970905888","+380 97 090 58 88"],
      ["+380970400404","+380 97 040 04 04"]
    ],
    address:"м. Одеса, вул. Косівська, 2г",
    map:"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent("Одеса Косівська 2г")
  },

  mykolaiv:{
    name:"Миколаїв",
    phone:"+380978782391",
    label:"+380 97 878 23 91",
    note:"Заберемо та доставимо у вашому місті"
  },

  izmail:{
    name:"Ізмаїл",
    phone:"+380978782391",
    label:"+380 97 878 23 91",
    note:"Заберемо та доставимо у вашому місті"
  },

  tbilisi:{
    name:"Тбілісі",
    phone:"+995555959746",
    label:"+995 555 95 97 46",
    map:"https://maps.app.goo.gl/7TXDDoVBf2SnmQKi7?g_st=ipc"
  },

  batumi:{
    name:"Батумі",
    phone:"+995555959746",
    label:"+995 555 95 97 46",
    note:"Заберемо та доставимо у вашому місті"
  }

};


/* ФІЛІАЛИ */

function openBranch(key){

  const b = branches[key];

  if(!b) return;

  let callButtons = "";

  if(b.phones){

    callButtons = b.phones
      .map(([p,l]) =>
        `<a class="primary" href="tel:${p}">Подзвонити ${l}</a>`
      )
      .join("");

  }else{

    callButtons =
      `<a class="primary" href="tel:${b.phone}">Подзвонити ${b.label}</a>`;

  }

  const body = document.getElementById("modalBody");

  if(!body) return;

  body.innerHTML = `

    <button class="close" onclick="closeBranch()">×</button>

    <h2>${b.name}</h2>

    ${b.address ? `<p>${b.address}</p>` : ""}

    ${b.note ? `<p>${b.note}</p>` : ""}

    <div class="actions">

      ${callButtons}

      ${
        b.map
          ? `<a href="${b.map}" target="_blank" rel="noopener">Прокласти маршрут</a>`
          : ""
      }

    </div>

  `;

  const backdrop = document.getElementById("modalBackdrop");

  if(backdrop){
    backdrop.classList.add("open");
  }

}


function closeBranch(){

  const modal = document.getElementById("modalBackdrop");

  if(modal){
    modal.classList.remove("open");
  }

}


/* МЕНЕДЖЕР */

function openManager(){

  const popup = document.getElementById("managerPopup");

  if(popup){
    popup.classList.add("open");
  }

}


function closeManager(){

  const popup = document.getElementById("managerPopup");

  if(popup){
    popup.classList.remove("open");
  }

}


/* ЗАПУСК */

document.addEventListener("DOMContentLoaded", () => {

  /*
    Автоматично відкриваємо
    через 10 секунд
  */

  setTimeout(() => {

    openManager();

  }, 10000);


  const form = document.getElementById("managerForm");

  if(!form) return;


  form.addEventListener("submit", async (event) => {

    event.preventDefault();


    const name =
      document
        .getElementById("managerName")
        .value
        .trim();


    const phone =
      document
        .getElementById("managerPhone")
        .value
        .trim();


    const region =
      document
        .getElementById("managerRegion")
        .value;


    if(!name || !phone || !region){

      alert("Будь ласка, заповніть усі поля.");

      return;
    }


    const button =
      document.getElementById("managerSubmit");


    const originalText =
      button.textContent;


    button.disabled = true;

    button.textContent = "ВІДПРАВЛЯЄМО...";


    try{

      const response = await fetch(
        "https://autosrs-leads-api.vercel.app/api/lead",
        {

          method:"POST",

          headers:{
            "Content-Type":"application/json"
          },

          body:JSON.stringify({
            name,
            phone,
            region
          })

        }
      );


      const result = await response.json();


      if(!response.ok || !result.success){

        throw new Error("Помилка відправки");

      }


      const formContent =
        document.getElementById("managerFormContent");


      const success =
        document.getElementById("managerSuccess");


      if(formContent){
        formContent.style.display = "none";
      }


      if(success){
        success.style.display = "block";
      }


    }catch(error){

      console.error(error);

      alert(
        "Не вдалося передати заявку. Будь ласка, спробуйте ще раз."
      );

      button.disabled = false;

      button.textContent = originalText;

    }

  });

});


/* ESC */

document.addEventListener("keydown", (event) => {

  if(event.key === "Escape"){

    closeBranch();

    closeManager();

  }

});
