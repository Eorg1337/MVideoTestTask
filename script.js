document.addEventListener("DOMContentLoaded", () => {
    const fileInputButton = document.getElementById("fp__my-button");
    const backButton = document.getElementById("sp__my-button");
    const fileInput = document.getElementById("myFile");
    const fileError = document.querySelector(".file__error");
    const fpWrapper = document.getElementById("fp__wrapper");
    const spContainer = document.querySelector(".sp__container");
    const myTable = document.querySelector(".my-table");
  
    fileInputButton.addEventListener("click", () => {
      if (localStorage.length <= 0) {
        fileInput.click();
      } else {
        createTableFromLocalStorage();
      }
    });
  
    backButton.addEventListener("click", () => {
      fpWrapper.style.display = "flex";
      spContainer.style.display = "none";
      localStorage.clear();
    });
  
    fileInput.addEventListener("change", () => {
      fileError.style.opacity = 0;
      const file = fileInput.files[0];
      if (file) {
        const fileExtension = file.name.split(".").pop();
        if (fileExtension === "csv" || fileExtension === "CSV") {
          fpWrapper.style.display = "none";
          getFile((fileData) => {
            let dataArray = fileData.split("\r\n").map((item) => item.split(","));
            dataArray.slice(1, -1).forEach((row) => {
              const [name, phone, email, bday, ...address] = row;
              const addressString = address.join("").replace(/"/g, "");
              localStorage.setItem(localStorage.length, row);
              myTable.appendChild(createTableRow(name, phone, email, bday, addressString));
            });
            spContainer.style.display = "flex";
          });
        } else {
          fileError.style.opacity = 1;
        }
      }
    });
  
    if (localStorage.length > 0) {
      createTableFromLocalStorage();
    }
  });
  
  function getFile(callback) {
    const file = document.getElementById("myFile").files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const fileData = reader.result;
      callback(fileData);
    };
    reader.readAsText(file, "windows-1251");
  }
  
  function createTableRow(name, phone, email, bday, address) {
    const row = document.createElement("tr");
    const rowData = [name, phone, email, bday, address];
  
    rowData.forEach((data) => {
      const cell = document.createElement("td");
      cell.textContent = data;
      row.appendChild(cell);
    });
  
    return row;
  }
  
  function createTableFromLocalStorage() {
    const fpWrapper = document.getElementById("fp__wrapper");
    const spContainer = document.querySelector(".sp__container");
    const myTable = document.querySelector(".my-table");
    const tbody = myTable.querySelector("tbody");
    fpWrapper.style.display = "none";
    spContainer.style.display = "flex";
  
    while (myTable.firstChild) {
      if (myTable.firstChild !== tbody) {
        myTable.removeChild(myTable.firstChild);
      } else {
        break;
      }
    }
  
    for (let i = 1; i < localStorage.length; i++) {
        const row = localStorage.getItem(i).split(",");
        const [name, phone, email, bday, ...address] = row;
        const addressString = address.join("").replace(/"/g, "");
  
      myTable.appendChild(createTableRow(name, phone, email, bday, addressString));
    }
  }