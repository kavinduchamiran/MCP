let t_id = 0
const transport = (state = [], action) => {
    t_id += 1
    switch (action.type) {
        case 'transport':
            return [
                ...state,
                {
                    id: t_id,
                    t_type: action.t_type,
                    name: action.name,
                    seats: action.seats,
                    vehicleNumber: action.vehicleNumber
                }
            ]
        default:
            return state
    }

}

export default transport
