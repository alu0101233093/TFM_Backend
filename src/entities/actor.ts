export interface Actor {
    id: number
    name: string
    biography: string
    birthday: string
    deathday: string | null
    gender: string
    known_for_department: string
    place_of_birth: string
    profile_path: string
}

export const genderToString = (gender: number): string => {
    switch (gender) {
        case 0: return 'Not specified'
        case 1: return 'Female'
        case 2: return 'Male'
        case 3: return 'Non-binary'
        default: return ''
    }
}