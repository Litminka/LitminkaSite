export enum FollowTypes {
    Follow = 'follow',
    Announcement = 'announcement',
}

export enum AnimeStatuses {
    Announced = 'announced',
    Released = 'released',
    Ongoing = 'ongoing',
}

export enum AnimePgaRatings {
    None = 'none',
    G = 'g',
    PG = 'pg',
    PG_13 = 'pg_13',
    R = 'r',
    R_plus = 'r_plus',
    RX = 'rx',
}

export enum AnimeMediaTypes {
    TV = 'tv',
    TV_special = 'tv_special',
    Special = 'special',
    ONA = 'ona',
    OVA = 'ova',
    Movie = 'movie',
}

export enum NotifyStatuses {
    AnimeRelease = 'anime_released',
    EpisodeRelease = 'episode_released',
    FinalEpisodeReleased = 'final_episode_released',
}

export enum AnimeListStatuses {
    planned = 'planned',
    watching = 'watching',
    rewatching = 'rewatching',
    completed = 'completed',
    on_hold = 'on_hold',
    dropped = 'dropped',
}

export interface PosterAnime {
    id: number;
    slug: string;
    image: string;
    name: string;
    status: string;
    rpaRating: string;
    shikimoriId: number;
    rating: number;
    mediaType: string;
}

export interface MediaTypes {}

export interface Genre {
    id: number;
    name: string;
    nameRussian: string;
    kind: string;
}

export interface TranslationGroup {
    id: number;
    type: 'voice' | 'subtitles';
    name: string;
}

export interface AnimeTranslation {
    id: number;
    currentEpisodes: number;
    groupId: number;
    animeId: number;
    link: string;
    group: TranslationGroup;
}

export interface AnimeRelation {
    id: number;
    animeId: number;
    relatedTo: number;
    name: string;
}

export interface Anime {
    id: number;
    image: string;
    name: string;
    description: string;
    status: string;
    slug: string;
    currentEpisodes: number;
    englishName: string;
    firstEpisodeAired: string;
    franchiseName: string;
    japaneseName: string;
    kodikLink: string;
    lastEpisodeAired: string;
    maxEpisodes: number;
    mediaType: AnimeMediaTypes;
    rpaRating: AnimePgaRatings;
    shikimoriId: number;
    shikimoriRating: number;
    banned: boolean;
    censored: boolean;
    hasRelation: boolean;
    rating: number;
    season: string;
    genres: Genre[];
    animeTranslations: AnimeTranslation[];
    relations: AnimeRelation[];
}

export interface User {
    id: number;
    email: string;
    login: string;
    password: string;
    name: string;
    createdAt: string;
    roleId: number;
    role: Role;
}

export interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

export interface Permission {
    id: number;
    name: string;
}
