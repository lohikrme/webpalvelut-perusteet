

// define interfaces to access the database variables easier
interface Hero {
    hero_id: number,
    hero_name: string,
    is_xman: string,
    was_snapped: string
};

interface Hero_power {
    hero_id: number,
    hero_power: string,
};

export { Hero, Hero_power };

