class LeafletMap {

    constructor(containerId, center, zoom) {
        this.map = L.map(containerId).setView(center, zoom);
        this.initTileLayer();
        
        this.attendanceCountTEP = 0;
        this.attendanceCountCSS = 0;
        this.attendanceCountBA = 0;
        this.attendanceCountGOAT= 0;

        this.markerCounts = {};
        this.markers = [];
        this.loggedData = []; 

        this.btn = document.getElementById('btn');
        this.btn1 = document.getElementById('btn1');
        this.btn2 = document.getElementById('btn2');
        this.btn3 = document.getElementById('btn3');
        this.btnclear = document.getElementById('btnclear');
        this.logCountElement = document.getElementById('logCountTEP');
        this.logCount1Element = document.getElementById('logCountCCS');
        this.logCount2Element = document.getElementById('logCountBA');
        this.logCount3Element = document.getElementById('logCountGOAT');
        this.idContainer = document.getElementById('logContainer');

        this.btn.addEventListener('click', () => this.dataTEP());
        this.btn1.addEventListener('click', () => this.dataCSS());
        this.btn2.addEventListener('click', () => this.dataBA());
        this.btn3.addEventListener('click', () => this.dataGOAT());
        this.btnclear.addEventListener('click', () => this.clearLogs());

    }

    initTileLayer() {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
    }

    addMarker(lat, long, message) {
        const marker = L.marker([lat, long]).addTo(this.map);
        this.markerCounts[message] = (this.markerCounts[message] || 0) + 1;
        this.updateMarkerPopup(marker, message);

        marker.on('click', () => {
            this.markerCounts[message]++;
            this.updateMarkerPopup(marker, message);
        });

        this.markers.push(marker);
    }
    
    updateMarkerPopup(marker, message) {
        const count = this.markerCounts[message];
        marker.bindPopup(`${message}<br>Attendance logs: ${count}`).openPopup();
    }
    loadMarkersFromJson(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                data.forEach(marker => {
                    this.addMarker(marker.latitude, marker.longitude, marker.message);
                });
            })
            .catch(error => console.error("Error loading servers:", error));
    }
    
    clearLogs() {
        this.attendanceCountTEP = 0;
        this.attendanceCountCSS = 0;
        this.attendanceCountBA = 0;
        this.attendanceCountGOAT = 0;

        this.loggedData = [];
        this.markerCounts = {}; 
        this.markers.forEach(marker => {
            const message = marker.getPopup().getContent().split('<br>')[0]; 
            this.markerCounts[message] = 0;
            this.updateMarkerPopup(marker, message); 
        });

        this.updateLogDisplay();
    }
    
    displayLogCount() {      
        this.logCountElement.innerHTML = `TEP Building Attendance: ${this.attendanceCountTEP}`;
        this.logCount1Element.innerHTML = `CSS Building Attendance: ${this.attendanceCountCSS}`;
        this.logCount2Element.innerHTML = `BA Building Attendance: ${this.attendanceCountBA}`;
        this.logCount3Element.innerHTML = `GOAT Building Attendance: ${this.attendanceCountGOAT}`;
    }

    
    dataTEP() {
        this.addMarker(8.3601987, 124.8594032, 'TEP Building');
        this.attendanceCountTEP++; 
        this.updateLogDisplay();
    }

    
    dataCSS() {
        this.addMarker(8.359576, 124.869183, 'CSS Building');
        this.attendanceCountCSS++;
        this.updateLogDisplay();
    }

    dataBA() {
        this.addMarker(8.359141, 124.868592, 'BA Building');
        this.attendanceCountBA++;
        this.updateLogDisplay();
    }
    dataGOAT() {
        this.addMarker(8.3548458, 124.8644220, 'BA GOAT');
        this.attendanceCountGOAT++;
        this.updateLogDisplay();
    }

    updateLogDisplay() {
        this.idContainer.innerHTML = ''; 
        this.loggedData.forEach(data => {
            const logItem = document.createElement('div');
            logItem.className = 'log-item';
            logItem.textContent = data; 
            this.idContainer.appendChild(logItem);
        });
        this.displayLogCount();
    }
}
    const Mymap = new LeafletMap('map', [8.359735, 124.869206], 18);
    Mymap.loadMarkersFromJson('applet-2.json');
    
    document.addEventListener('DOMContentLoaded', () => {
        Mymap.displayLogCount();
    });

  


