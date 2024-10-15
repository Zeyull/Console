declare namespace API {
  type AddAnnouncementData = {
    content: string;
    announcement_time: string;
    icon: string;
  };

  type AddAnnouncementResponse =
    // #/components/schemas/CommonResponse
    CommonResponse & {
      data?: AnnouncementData;
    };

  type AddArticleData = {
    title: string;
    content: string;
    picture?: string;
  };

  type AddArticleResponse =
    // #/components/schemas/CommonResponse
    CommonResponse & {
      data?: { id?: Id };
    };

  type AnnouncementData = {
    id?: Id;
    content?: string;
    announcement_time?: string;
    icon?: string;
  };

  type AnnouncementListResponse =
    // #/components/schemas/CommonResponse
    CommonResponse & {
      data?: AnnouncementData[];
    };

  type ArticleData = {
    id: Id;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    picture?: string;
  };

  type ArticleListResponse =
    // #/components/schemas/CommonResponse
    CommonResponse & {
      data?: { pagination?: PaginationData; data?: ArticleData[] };
    };

  type ArticleResponse =
    // #/components/schemas/CommonResponse
    CommonResponse & {
      data?: ArticleData;
    };

  type CommonResponse = {
    code?: number;
    msg?: string;
    /** 公用的data字段 */
    data?: Record<string, any>;
  };

  type DeleteAnnouncementResponse =
    // #/components/schemas/CommonResponse
    CommonResponse & {
      data?: { id?: Id };
    };

  type ErrorResponse = {
    code?: number;
    msg?: string;
    /** 任意值 */
    data?: any;
  };

  type getArticleParams = {
    /** The unique identifier of the account */
    id: number;
  };

  type Id = number;

  type LoginResponse =
    // #/components/schemas/CommonResponse
    CommonResponse & {
      data?: { token?: string; id?: Id };
    };

  type PaginationData = {
    count?: number;
  };

  type RegisterResponse =
    // #/components/schemas/CommonResponse
    CommonResponse & {
      data?: { id?: Id };
    };

  type UpdateAnnouncementData = {
    content: string;
    announcement_time: string;
    icon: string;
  };

  type UpdateAnnouncementResponse =
    // #/components/schemas/CommonResponse
    CommonResponse & {
      data?: { id?: Id };
    };

  type UpdateArticleData = {
    title: string;
    content: string;
    picture?: string;
  };

  type updateArticleParams = {
    /** The unique identifier of the account to update */
    id: number;
  };

  type UpdateArticleResponse =
    // #/components/schemas/CommonResponse
    CommonResponse & {
      data?: { id?: Id };
    };

  type UserLogin = {
    username: string;
    password: string;
  };

  type UserRegister = {
    username: string;
    password: string;
  };

  type UserToken = {
    token: string;
  };

  type VerifyTokenResponse =
    // #/components/schemas/CommonResponse
    CommonResponse & {
      data?: { id?: Id; username?: string; description?: string };
    };
}