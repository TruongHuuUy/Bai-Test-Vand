// Sap xep lai data
const sortDescending = (fieldName, data) => {
    return data.sort((a, b) => b[fieldName] - a[fieldName]);
};

const sortAscending = (fieldName, data) => {
    return data.sort((a, b) => a[fieldName] - b[fieldName]);
};

const showModal = async () => {
    const dataCountriesApi = await fetchCountriesApi()
    const rowTable = document.getElementsByClassName("country-item")
    const modal = document.querySelector(".country");
    const overlay = document.querySelector(".overlay");

    const closeModal = function () {
        modal.classList.add("hidden");
        overlay.classList.add("hidden");
      };

    overlay.addEventListener("click", closeModal);

    if(rowTable) {
        // Destructuring 
        [...rowTable].forEach(item => {
            item.onclick = (e) => {
                const country = e.target.parentNode.dataset.country;

                for(let item of dataCountriesApi) {
                    if(item.name.common === country){
                        renderCountryHtml(item);
                        modal.classList.remove("hidden");
                        overlay.classList.remove("hidden");
                        return
                    }
                }
                renderCountryHtml();
                modal.classList.remove("hidden");
                overlay.classList.remove("hidden");
            }
        })
    }
    
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !modal.classList.contains("hidden")) {
          closeModal();
        }
    });
}

// Đổ data lên giao dien
const renderHtml = (data) => {
    const ulList = document.querySelector(".covid > tbody");

    const dataHtml = data.map((item) => {
        return `<tr class="country-item" data-country=${item.Country}> 
            <td>${item.Country}</td>
            <td>${(item.TotalConfirmed).toLocaleString()}</td>
            <td>${(item.NewConfirmed).toLocaleString()}</td>
            <td>${(item.TotalDeaths).toLocaleString()}</td>
            <td>${(item.TotalRecovered).toLocaleString()}</td>
        </tr>`;
    });
    ulList.innerHTML = dataHtml.join("");
    showModal()
};

const renderCountryHtml = (item) => {
    if(item){
        const ulList = document.querySelector(".country");
        const dataContries = `
             <h2 class="title-countries">THÔNG TIN QUỐC GIA</h2>
             <div class="row">
                 <div class="column left">
                     <h4 class="text-image">Quốc Kỳ<img class="img-flags" src="${item.flags.png}"></h4>
                 </div>
                 <div class="column middle text-modal"data-country=${item.name.common}>
                     <div>
                         <h4>Tên Viết Tắt: <span class="text-item">${item.altSpellings[0]}</span></h4>        
                     </div>
                     <div>
                         <h4>Tên Quốc Gia: <span class="text-item">${item.name.common}</span></h4>        
                     </div>
                     <div>
                         <h4>Thủ Đô: <span class="text-item">${item.capital}</span></h4>        
                     </div>
                     <div>
                         <h4>Khu Vực: <span class="text-item">${item.region}</span></h4>        
                     </div>
                     <div>
                         <h4>Tiểu Vùng: <span class="text-item">${item.subregion}</span></h4>        
                     </div>
                     <div>
                         <h4>Dân Số: <span class="text-item">${(item.population).toLocaleString()} người</span></h4>        
                     </div>
                 </div>
             </div>
         `;
     ;
     ulList.innerHTML = dataContries;
    } else {
        const ulList = document.querySelector(".country");
        const dataContries = `
             <h2 class="title-non-countries">Không tìm thấy thông tin Quốc Gia</h2>
             <h3>Mời bạn chọn Quốc gia khác</h3>
         `;
     ;
     ulList.innerHTML = dataContries;
    }
};

// Hàm lấy API covid 19
const fetchApi = async () => {
    // Lấy element bên HTML
    const newBtn = document.getElementById("new");
    const restoreBtn = document.getElementById("restore");
    const deathBtn = document.getElementById("death");

    // Gọi api và render data lần đầu tiên
    const response = await fetch(
        "https://api.covid19api.com/summary"
    );
    const jsonData = await response.json();
    renderHtml(jsonData.Countries);
   
    // Sắp xếp data theo số mới nhiễm
    newBtn.addEventListener("click", (e) => {
        e.target.classList.remove("buttonSort");
        e.target.classList.add("buttonSorted");

        restoreBtn.classList.remove("buttonSorted");
        restoreBtn.classList.add("buttonSort");

        deathBtn.classList.remove("buttonSorted");
        deathBtn.classList.add("buttonSort");

        const data = sortDescending("NewConfirmed", jsonData.Countries);
        renderHtml(data);
    });

    // Sắp xếp data theo số người chết
    deathBtn.addEventListener("click", (e) => {
        e.target.classList.remove("buttonSort");
        e.target.classList.add("buttonSorted");

        restoreBtn.classList.remove("buttonSorted");
        restoreBtn.classList.add("buttonSort");

        newBtn.classList.remove("buttonSorted");
        newBtn.classList.add("buttonSort");

        const data = sortDescending("TotalDeaths", jsonData.Countries);
        renderHtml(data);
    });

    // Sắp xếp data theo số phục hồi
    restoreBtn.addEventListener("click", (e) => {
        e.target.classList.remove("buttonSort");
        e.target.classList.add("buttonSorted");

        newBtn.classList.remove("buttonSorted");
        newBtn.classList.add("buttonSort");

        deathBtn.classList.remove("buttonSorted");
        deathBtn.classList.add("buttonSort");

        const data = sortAscending("TotalRecovered", jsonData.Countries);
        renderHtml(data);
    });
};

// Hàm lấy API Countries
const fetchCountriesApi = async () => {
    const responseCountry = await fetch(
        "https://restcountries.com/v3.1/all?fields=altSpellings,name,flags,population,capital,region,subregion"
    );
    const jsonDataCountry = await responseCountry.json();
    return jsonDataCountry
};

// Sau khi DOM load xong mới chạy js
window.addEventListener("DOMContentLoaded", () => {
    fetchApi();
});