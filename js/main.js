console.log(
    "%cHIRE ME%ctiagondelgado@gmail.com 003515962519814%cHIRE ME",
    "background:#ff0000; color:#000000; padding:5px;",
    "background:#FFFFFF; color:#000000; padding:5px; text-decoration: none;",
    "background:#ff0000; color:#000000; padding:5px;"
);

class Vehicle {
    constructor(
        id,
        make,
        model,
        type,
        price,
        registrationYear,
        version,
        seats,
        classCode,
        km,
        co2,
        isKm0,
        status,
        image,
        homologationStandard,
        liked
    ) {
        this.id = id;
        this.make = make ? make : "";
        this.model = model ? model : "";
        this.type = type ? type : "";
        this.price = price ? price : "";
        this.registrationYear = registrationYear ? registrationYear : "";
        this.version = version ? version : "";
        this.seats = seats ? seats : "";
        this.classCode = classCode ? classCode : "";
        this.km = km ? km : "";
        this.co2 = co2 ? co2 : "";
        this.isKm0 = isKm0 ? isKm0 : "";
        this.status = status ? status : "";
        this.image = image ? image : "";
        (this.liked = liked),
            (this.homologationStandard = homologationStandard
                ? homologationStandard
                : "");
    }
}

var app = new Vue({
    el: "#app",
    data: {
        search: "",
        unit: "km",
        load: true,
        liked: [],
        vehicleList: [],
    },
    mounted: function () {
        fetch("/data.json")
            .then((r) => r.json())
            .then((json) => {
                this.json = json;
                this.load = false;
                for (let a = 0; a < this.json.length; a++) {
                    this.vehicleList.push(
                        new Vehicle(
                            this.json[a].id,
                            this.json[a].make,
                            this.json[a].model,
                            this.json[a].type,
                            this.json[a].price,
                            this.json[a].registrationYear,
                            this.json[a].version,
                            this.json[a].seats,
                            this.json[a].classCode,
                            this.json[a].km,
                            this.json[a].co2,
                            this.json[a].isKm0,
                            this.json[a].status,
                            this.json[a].image,
                            this.json[a].homologationStandard
                        )
                    );
                }

                let likedCookie = this.getCookies("liked");

                if (likedCookie) {
                    likedCookie = JSON.parse(likedCookie);
                    for (let i = 0; i < likedCookie.length; i++) {
                        for (let a = 0; a < this.vehicleList.length; a++) {
                            if (this.vehicleList[a].id == likedCookie[i]) {
                                this.vehicleList[a].liked = true;
                                this.liked.push(this.vehicleList[a].id);
                            }
                        }
                    }
                }
            })
            .catch(function (_error) {
                console.log("error", _error);
                this.error = "Try later, sorry.";
            });
    },
    created: function () {},
    methods: {
        likeMe(_vehicle) {
            if (_vehicle.liked == true) {
                _vehicle.liked = false;
                this.liked = this.removeA(this.liked, _vehicle.id);
            } else {
                _vehicle.liked = true;
                this.liked.push(_vehicle.id);
            }
            let json_string = JSON.stringify(this.liked);
            this.setCookie("liked", json_string, 30);
        },
        priceformat(price) {
            const formatter = new Intl.NumberFormat("pt-PT", {
                style: "currency",
                currency: "EUR",
                minimumFractionDigits: 0,
            });
            return formatter.format(parseInt(price));
        },
        getcertificate(_co2) {
            let x = parseInt(_co2);
            if (x < 100) {
                return "A";
            } else if (x > 100 && x < 150) {
                return "B";
            } else {
                return "C";
            }
        },
        setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        },
        getCookies(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(";").shift();
        },
        changeMeasure(_unit) {
            this.unit = _unit;
        },
        m2kConverter(c) {
            if (this.unit == "km") {
                return (c / 1000).toFixed(3);
            } else {
                return ((c / 1.609344).toFixed(0) / 1000).toFixed(3);
            }
        },
        removeA(arr) {
            var what,
                a = arguments,
                L = a.length,
                ax;
            while (L > 1 && arr.length) {
                what = a[--L];
                while ((ax = arr.indexOf(what)) !== -1) {
                    arr.splice(ax, 1);
                }
            }
            return arr;
        },
    },
    computed: {
        filteredList() {
            if (!this.search) return this.vehicleList;
            let searchText = this.search.toLowerCase();
            return this.vehicleList.filter((p) => {
                return (
                    p.make.toLowerCase().includes(searchText) ||
                    p.model.toLowerCase().includes(searchText) ||
                    p.version.toLowerCase().includes(searchText)
                );
            });
        },
    },
});
