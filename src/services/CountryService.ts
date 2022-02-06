export class CountryService {

    getCountries() {
        return fetch('./assets/json/countries.json', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(res => {
                debugger;
                return res.json()
            })
                .then(d => {
                    debugger;
                })
    }
}