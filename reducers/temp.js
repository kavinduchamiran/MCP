const temp = (state = [], action) => {
    switch (action.type) {
        case 'user_type':
            return [
                ...state,
                {
                    user_type: action.text,

                }
            ]
        case 'name':
            return [
                ...state,
                {
                    text: action.text,
                }
            ]
        case 'email':
            return [
                ...state,
                {
                    text: action.text,
                }
            ]
        case 'type':
            return [
                ...state,
                {
                    text: action.text,
                }
            ]
        default:
            return state
    }
}

export default temp
