import axios from 'axios'

const url = {
    all: 'https://restcountries.eu/rest/v2/all',
    code: 'https://restcountries.eu/rest/v2/alpha/'
}

export default {
    getAllCountries(cb) {
        axios.get(url.all, {
            params: {fields: 'flag;name;alpha2Code;alpha3Code;nativeName;altSpellings;callingCodes'}
        }).then((response) => {
            cb(response.data)
        }).catch((error) => {
            console.error(error)
        });
    },

    getByCountry(code, cb) {
        axios.get(`${url.code}${code}`).then((response) => {
            cb(response.data)
        }).catch((error) => {
            console.error(error)
        });
    }
}
