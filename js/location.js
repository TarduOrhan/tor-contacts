document.addEventListener('DOMContentLoaded', function() {
    const getLocationBtn = document.getElementById('getLocationBtn');
    const locationResult = document.getElementById('locationResult');
    const latitudeElement = document.getElementById('latitude');
    const longitudeElement = document.getElementById('longitude');
    const altitudeElement = document.getElementById('altitude');


    getLocationBtn.addEventListener('click', () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    const altitude = position.coords.altitude; // Yükseklik 

                latitudeElement.textContent = `Enlem: ${latitude}`;
                longitudeElement.textContent = `Boylam: ${longitude}`;
                // altitudeElement.textContent = altitude ? `Yükseklik: ${altitude} metre` : 'Yükseklik bilgisi mevcut değil';
                    locationResult.classList.remove('hide');
                },
                function(error) {
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            console.error("Kullanıcı konum bilgisini paylaşmayı reddetti.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            console.error("Konum bilgisi alınamadı.");
                            break;
                        case error.TIMEOUT:
                            console.error("Konum bilgisi alma zaman aşımına uğradı.");
                            break;
                        case error.UNKNOWN_ERROR:
                            console.error("Bilinmeyen bir hata oluştu.");
                            break;
                    }
                },
                { timeout: 10000, maximumAge: 60000, enableHighAccuracy: true }
            );
        } else {
            console.error("Tarayıcı konum bilgilerini desteklemiyor.");
        }
    });
});
