// d.ts file for this project
export type forumPost = {
    created_date: string;
    source: "hackernews" | "reddit" | "stackexchange"
    sub_source: string, // subreddit or stackexchange site
    title: string;
    type: "post" | "comment" | "story" | "question" | "answer" | "extn loading";
    url: string;
    score: number;
    comment_count: number;
    is_accepted_answer: boolean;
}

export type Settings = {
    types: string[],
    limit: number
}

export type CrxExtnScript = "popup" | "content_script" | "background"

export interface CrxExtnMsg {
    source: CrxExtnScript
    dest: CrxExtnScript
}

export interface CrxExtnQuery extends CrxExtnMsg {
    url: string
}

export interface CrxExtnResp extends CrxExtnMsg {
    results: forumPost[];
    error?: string;
    errorCode?: number
}

// node-fetch response
export type NFResponse = import("./node_modules/node-fetch/@types/index").Response

export interface redditPost {
    id: string;
    numComments: number;
    created: number;
    score: number;
    distinguishType?: null;
    isLocked: boolean;
    isStickied: boolean;
    thumbnail: {
        url: string;
        width: number;
        height: number;
    };
    title: string;
    author: string;
    authorId: string;
    authorIsBlocked: boolean;
    domain: string;
    postId: string;
    upvoteRatio: number;
    numDuplicates?: null;
    discussionType?: null;
    viewCount: number;
    goldCount: number;
    isArchived: boolean;
    contestMode: boolean;
    gildings: {
        gid1: number;
        gid2: number;
        gid3: number;
    };
    postCategories?: null;
    suggestedSort?: null;
    belongsTo: {
        id: string;
        type: string;
    };
    flair?: ({
        text: string;
        type: string;
        textColor: string;
        backgroundColor: string;
        templateId?: null;
      })[] | null;
    hidden: boolean;
    saved: boolean;
    isGildable: boolean;
    isMediaOnly: boolean;
    isSponsored: boolean;
    isNSFW: boolean;
    isMeta: boolean;
    isSpoiler: boolean;
    isBlank: boolean;
    sendReplies: boolean;
    voteState: number;
    permalink: string;
    events?: (null)[] | null;
    eventsOnRender?: (null)[] | null;
    callToAction?: null;
    domainOverride?: null;
    impressionId?: null;
    impressionIdStr?: null;
    isCreatedFromAdsUi: boolean;
    media?: null;
    preview: {
        url: string;
        width: number;
        height: number;
    };
    crosspostRootId?: null;
    crosspostParentId?: null;
    numCrossposts: number;
    isCrosspostable: boolean;
    liveCommentsWebsocket: string;
    source: {
        displayText: string;
        url: string;
    };
    isOriginalContent: boolean;
    contentCategories?: null;
    isScoreHidden: boolean;
    awardCountsById: {
        [key: string]: number
    };
}

// Taken via inspecting https://hn.algolia.com/?dateRange=all&page=0&prefix=true&query=https%3A%2F%2Fblog.sigplan.org%2F&sort=byPopularity&type=all
// HNComment and HNStory are slightly different in which values are allowed to be null
// HN => Hacker News
export type HNPost = {
    hits: (HNComment | HNStory)[];
    nbHits: number;
    page: number;
    nbPages: number;
    hitsPerPage: number;
    exhaustiveNbHits: boolean;
    query: string;
    params: string;
    queryID: string;
    serverUsed: string;
    indexUsed: string;
    parsedQuery: string;
    timeoutCounts: boolean;
    timeoutHits: boolean;
    processingTimeMS: number;
}


export interface HNStory {
    created_at: string;
    title: string;
    url: string;
    author: string;
    points: number;
    story_text?: null;
    comment_text?: null;
    num_comments: number;
    story_id?: null;
    story_title?: null;
    story_url?: null;
    parent_id?: null;
    created_at_i: number;
    relevancy_score?: number | null;
    _tags?: (string)[] | null;
    objectID: string;
    _highlightResult: {
        title: {
            value: string;
            matchLevel: string;
            matchedWords?: (null)[] | null;
        };
        url: {
            value: string;
            matchLevel: string;
            fullyHighlighted: boolean;
            matchedWords?: (string)[] | null;
        };
        author: {
            value: string;
            matchLevel: string;
            matchedWords?: (null)[] | null;
        };
    };
    _rankingInfo: {
        nbTypos: number;
        firstMatchedWord: number;
        proximityDistance: number;
        userScore: number;
        geoDistance: number;
        geoPrecision: number;
        nbExactWords: number;
        words: number;
        filters: number;
    };
}

export interface HNComment {
    created_at: string;
    title?: null;
    url?: null;
    author: string;
    points?: null;
    story_text?: null;
    comment_text: string;
    num_comments?: null;
    story_id: number;
    story_title: string;
    story_url?: string | null;
    parent_id: number;
    created_at_i: number;
    _tags?: (string)[] | null;
    objectID: string;
    _highlightResult: {
        author: {
            value: string;
            matchLevel: string;
            matchedWords?: (null)[] | null;
        };
        comment_text: {
            value: string;
            matchLevel: string;
            fullyHighlighted: boolean;
            matchedWords?: (string)[] | null;
        };
        story_title: {
            value: string;
            matchLevel: string;
            matchedWords?: (null)[] | null;
        };
        story_url?: {
            value: string;
            matchLevel: string;
            fullyHighlighted: boolean;
            matchedWords?: (string)[] | null;
        } | null;
        };
    _rankingInfo: {
        nbTypos: number;
        firstMatchedWord: number;
        proximityDistance: number;
        userScore: number;
        geoDistance: number;
        geoPrecision: number;
        nbExactWords: number;
        words: number;
        filters: number;
    };
}

// SE => Stack Exchange
export interface SEResp {
    items: (SEQuestion | SEAnswer)[];
    has_more: boolean;
    quota_max: number;
    quota_remaining: number;
}

export type SEPostType = "question" | "answer"

export interface SEPost {
    tags: (string)[];
    question_score: number;
    is_accepted: boolean;
    is_answered: boolean;
    question_id: number;
    item_type: SEPostType;
    score: number;
    last_activity_date: number;
    creation_date: number;
    body: string;
    excerpt: string;
    title: string;
}

export interface SEQuestion extends SEPost {
    has_accepted_answer: boolean;
    answer_count: number;
}

export interface SEAnswer extends SEPost {
    answer_id: number;
}
  