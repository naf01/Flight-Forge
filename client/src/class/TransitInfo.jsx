class TransitInfo {
    constructor(transit, date, airport, route, airplaneid, airplanename, seatsLeft, distance, cost) {
        this.transit = transit;
        this.date = date;
        this.airport = airport;
        this.route = route;
        this.airplaneid = airplaneid;
        this.airplanename = airplanename;
        this.seatsLeft = seatsLeft;
        this.distance = distance;
        this.cost = cost;
    }
}

export default TransitInfo;