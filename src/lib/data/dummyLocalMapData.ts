import { LocalResultType } from "@/types/localResult";

export const localMapData: LocalResultType = {
  local_map: {
    link: "https://www.google.com/search?hl=en&gl=us&q=mcdonalds&npsic=0&rflfq=1&rldoc=1&rlha=0&rllag=32431150,-99733487,4363&tbm=lcl&sa=X&ved=2ahUKEwi07q2576DlAhUEv54KHXtrAtUQtgN6BAgIEAQ",
    image:
      "https://serpapi.com/searches/6874f229b2c613fdd776d7a2/images/6e2624176fbce3cad030e768fe990f41.png%22",
    gps_coordinates: {
      latitude: 32.43115,
      longitude: -99.733487,
    },
  },
  local_results: {
    more_locations_link:
      "https://www.google.com/search?hl=en&gl=us&q=mcdonalds&npsic=0&rflfq=1&rldoc=1&rlha=0&rllag=32431150,-99733487,4363&tbm=lcl&sa=X&ved=2ahUKEwi07q2576DlAhUEv54KHXtrAtUQjGp6BAgIEC0",
    places: [
      {
        position: 1,
        label: "A",
        title: "McDonald's",
        place_id: "9217580661049740855",
        lsig: "AB86z5WZ0L4jOJdygGcgZJxwaZqT",
        place_id_search:
          "https://serpapi/search.json?device=desktop&engine=google&gl=us&google_domain=google.com&hl=en&location=austin%2C+tx%2C+texas%2C+united+states&ludocid=9217580661049740855&q=mcdonalds&tbm=lcl&token=ae38ed37970df6b0",
        links: {
          delivery:
            "https://orderfood.google.com/chooseprovider?restaurantId=/g/1thy06lf&hl=en-US&gei=IBmnXbTeK4T--gT71omoDQ&utm_source=search_restaurant_list&authuser=-1&fo_s=OA,AH&fo_m=CDEIMAgvCCAIOAgqCCsIKAgYCCcIKQgPCBMICwgsCAwIEQgKCC0IFAgSCC4ICAgQCB4IHQgmCAMIAggyCDMIJQg3CCIIJAg2CDQINQgj",
          website:
            "https://www.mcdonalds.com/us/en-us/location/TX/ABILENE/4302-BUFFALO-GAP-RD/5432.html?cid=RF:YXT:GMB::Clicks",
          directions:
            "https://www.google.com/maps/dir//McDonald's,+4302+Buffalo+Gap+Rd,+Abilene,+TX+79605/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x86568db0e778b561:0x7feb6cc63e614e37?sa=X&hl=en",
        },
        phone: "(325) 695-2616",
        address: "4302 Buffalo Gap Rd",
        hours: "Open 24 hours",
        gps_coordinates: {
          latitude: 32.3997901,
          longitude: -99.7594225,
        },
        rating: 3.9,
        reveiw: 1234,
      },

      {
        position: 2,
        label: "B",
        title: "McDonald's",
        place_id: "9912131383807101605",
        lsig: "AB86z5Vr7I7_Du4pdOcCURnP7CuQ",
        place_id_search:
          "https://serpapi/search.json?device=desktop&engine=google&gl=us&google_domain=google.com&hl=en&location=austin%2C+tx%2C+texas%2C+united+states&ludocid=9912131383807101605&q=mcdonalds&tbm=lcl&token=1af2526ee1d9a0e1",
        links: {
          delivery:
            "https://orderfood.google.com/chooseprovider?restaurantId=/g/1tdqb_74&hl=en-US&gei=IBmnXbTeK4T--gT71omoDQ&utm_source=search_restaurant_list&authuser=-1&fo_s=OA,AH&fo_m=CDEIMAgvCCAIOAgqCCsIKAgYCCcIKQgPCBMICwgsCAwIEQgKCC0IFAgSCC4ICAgQCB4IHQgmCAMIAggyCDMIJQg3CCIIJAg2CDQINQgj",
          website:
            "https://www.mcdonalds.com/us/en-us/location/TX/ABILENE/3147-S-14TH-ST/18074.html?cid=RF:YXT:GMB::Clicks",
          directions:
            "https://www.google.com/maps/dir//McDonald's,+3147+S+14th+St,+Abilene,+TX+79605/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x86568e7926837c17:0x898ef6fa12d2caa5?sa=X&hl=en",
        },
        phone: "(325) 691-5902",
        address: "3147 S 14th St",
        hours: "Open 24 hours",
        gps_coordinates: {
          latitude: 32.43174,
          longitude: -99.761488,
        },
        rating: 3.9,
        reveiw: 1234,
      },
    ],
  },
};
