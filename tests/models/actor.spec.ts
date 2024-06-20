import { Actor } from "../../src/models/actor/actor";
import { ActorProfile, genderToString } from "../../src/models/actor/actorProfile";

describe('Actor Model', () => {
    test('should create an actor with correct properties', () => {
        const actor: Actor = {
            id: 1,
            known_for_department: 'Acting',
            name: 'John Doe',
            profile_path: '/path/to/profile.jpg',
            character: 'Main Character'
        };

        expect(actor).toHaveProperty('id', 1);
        expect(actor).toHaveProperty('known_for_department', 'Acting');
        expect(actor).toHaveProperty('name', 'John Doe');
        expect(actor).toHaveProperty('profile_path', '/path/to/profile.jpg');
        expect(actor).toHaveProperty('character', 'Main Character');
    });
});

describe('ActorProfile Model', () => {
    test('should create an actor profile with correct properties', () => {
        const actorProfile: ActorProfile = {
            id: 1,
            name: 'John Doe',
            biography: 'An accomplished actor known for various roles.',
            birthday: '1980-01-01',
            deathday: null,
            gender: 'Male',
            known_for_department: 'Acting',
            place_of_birth: 'Los Angeles, California, USA',
            profile_path: '/path/to/profile.jpg'
        };

        expect(actorProfile).toHaveProperty('id', 1);
        expect(actorProfile).toHaveProperty('name', 'John Doe');
        expect(actorProfile).toHaveProperty('biography', 'An accomplished actor known for various roles.');
        expect(actorProfile).toHaveProperty('birthday', '1980-01-01');
        expect(actorProfile).toHaveProperty('deathday', null);
        expect(actorProfile).toHaveProperty('gender', 'Male');
        expect(actorProfile).toHaveProperty('known_for_department', 'Acting');
        expect(actorProfile).toHaveProperty('place_of_birth', 'Los Angeles, California, USA');
        expect(actorProfile).toHaveProperty('profile_path', '/path/to/profile.jpg');
    });
});

describe('genderToString Function', () => {
    test('should return correct string for gender 0', () => {
        expect(genderToString(0)).toBe('Not specified');
    });

    test('should return correct string for gender 1', () => {
        expect(genderToString(1)).toBe('Female');
    });

    test('should return correct string for gender 2', () => {
        expect(genderToString(2)).toBe('Male');
    });

    test('should return correct string for gender 3', () => {
        expect(genderToString(3)).toBe('Non-binary');
    });

    test('should return empty string for unknown gender', () => {
        expect(genderToString(99)).toBe('');
    });
});
