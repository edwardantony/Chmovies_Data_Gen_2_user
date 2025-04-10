import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Users: a.model({
    id: a.id().required(),
    cognitoId: a.string().required(),
    email: a.string().required(),
    username: a.string(),
    firstName: a.string(),
    lastName: a.string(),
    phoneNumber: a.string(),
    profilePicture: a.string(),
    dateOfBirth: a.date(),
    gender: a.enum(['Male', 'Female', 'Other', 'PreferNotToSay']),
    role: a.json(),
    country: a.string(),
    status: a.enum(['Active', 'Inactive', 'Cancelled', 'Expired']),
    lastLogin: a.datetime(),
    accountStatus: a.enum(['Active', 'Suspended', 'Deleted']),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
    
    // Relationships
    userProfiles: a.hasMany('UserProfiles', 'userId'),
    userSubscriptions: a.hasMany('UserSubscriptions', 'userId'),
    userPayments: a.hasMany('UserPayments', 'userId'),
    userFavorites: a.hasMany('UserFavorites', 'userId'),
    userReviews: a.hasMany('UserReviews', 'userId'),
    userReactions: a.hasMany('UserReactions', 'userId'),
    userWatchHistories: a.hasMany('UserWatchHistories', 'userId'),
    userLogs: a.hasMany('UserLogs', 'userId'),
    userNotifications: a.hasMany('UserNotifications', 'userId')
  })
  .authorization(allow => [
    allow.owner(),
    allow.groups(['Admin']),
    allow.group('Moderator').to(['read', 'update'])
  ]),

  UserProfiles: a.model({
    id: a.id().required(),
    userId: a.id().required(),
    profileName: a.string().required(),
    pin: a.integer(),
    languagePreference: a.json(),
    isActive: a.boolean().default(true),
    avatar: a.string(),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),

    // Relationships
    user: a.belongsTo('Users', 'userId'),
  })  
  .secondaryIndexes(index => [
    index('userId').name('byUserId'),
  ])
  .authorization(allow => [
    allow.owner(),
    allow.groups(['Admin']),
    allow.group('Moderator').to(['read', 'update'])
  ]),

  UserSubscriptions: a.model({
    id: a.id().required(),
    userId: a.id().required(),
    userPaymentId: a.string(),
    userSubscriptionId: a.string(),
    titleId: a.string().required(),
    subscriptionPlan: a.json(),
    startDate: a.date().required(),
    endDate: a.date().required(),
    type: a.enum(['CableTV', 'OTT']),
    status: a.enum(['Active', 'Inactive', 'Cancelled', 'Expired', 'Pending', 'Refunded', 'Failed']),
    autoRenew: a.boolean().default(true),
    paymentMethod: a.string(),
    lastPaymentDate: a.datetime(),
    nextBillingDate: a.date(),
    cancellationDate: a.date(),
    cancellationReason: a.string(),
    trialPeriodEnd: a.date(),
    billingAddress: a.json(),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
    
    // Relationships
    user: a.belongsTo('Users', 'userId'),
    userPayments: a.hasMany('UserPayments', 'userSubscriptionId'),
    userInvoices: a.hasMany('UserInvoices', 'userSubscriptionId'),
  })
  .secondaryIndexes(index => [
    index('userId').name('byUser'),
    index('status').name('byStatus'),
    index('endDate').name('byExpiration'),
    index('type').name('byType'),
    index('createdAt').name('byDate'),
  ])
  .authorization(allow => [
    allow.owner(),
    allow.groups(['Admin']),
    allow.groups(['Moderator']).to(['read', 'update'])
  ]),

  UserPayments: a.model({
    id: a.id().required(),
    userId: a.id().required(),
    userSubscriptionId: a.id(),
    type: a.enum(['CableTV', 'OTT', 'Other']),
    amount: a.float().required(),
    currency: a.string(),
    paymentMethod: a.string().required(),
    paymentGateway: a.string().required(),
    transactionId: a.string().required(),
    status: a.enum(['Pending', 'Completed', 'Failed', 'Refunded']),
    paymentDate: a.datetime().required(),
    description: a.string(),
    metadata: a.json(),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
    
    // Relationships
    user: a.belongsTo('Users', 'userId'),
    userSubscription: a.belongsTo('UserSubscriptions', 'userSubscriptionId'),
    userInvoices: a.hasMany('UserInvoices', 'paymentId'), 
  })
  .secondaryIndexes((index) => [
    index('userId').name('byUser'),
    index('createdAt').name('byDate'),
  ])
  .authorization(allow => [
    allow.owner(),
    allow.groups(['Admin']),
    allow.group('Moderator').to(['read', 'update'])
  ]),

  UserInvoices: a.model({
    id: a.id().required(),
    userId: a.id().required(),
    userSubscriptionId: a.id(),
    paymentId: a.id(),
    invoiceNumber: a.string().required(),
    amount: a.float().required(),
    currency: a.string(),
    taxAmount: a.float(),
    discountAmount: a.float(),
    totalAmount: a.float().required(),
    billingPeriod: a.string(),
    invoiceDate: a.date().required(),
    dueDate: a.date().required(),
    status: a.enum(['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled']),
    pdfUrl: a.string(),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
    
    // Relationships
    user: a.belongsTo('Users', 'userId'),
    userSubscription: a.belongsTo('UserSubscriptions', 'userSubscriptionId'),
    payment: a.belongsTo('UserPayments', 'paymentId'),
  })
  .secondaryIndexes((index) => [
    index('userId').name('byUser'),
    index('createdAt').name('byDate'),
  ])
  .authorization(allow => [
    allow.owner(),
    allow.groups(['Admin']),
    allow.group('Moderator').to(['read', 'update'])
  ]),

  UserFavorites: a.model({
    id: a.id().required(),
    userId: a.id().required(),
    titleId: a.string().required(),
    createdAt: a.datetime(),

    // Relationships
    user: a.belongsTo('Users', 'userId')
  })
  .authorization(allow => [
    allow.owner(),
    allow.groups(['Admin']),
    allow.group('Moderator').to(['read', 'update'])
  ]),

  UserReviews: a.model({
    id: a.id().required(),
    userId: a.id().required(),
    titleId: a.string().required(),
    rating: a.integer().required(),
    reviewText: a.string(),
    isApproved: a.boolean().default(false),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),

    // Relationships
    user: a.belongsTo('Users', 'userId')
  })
  .authorization(allow => [
    allow.owner(),
    allow.groups(['Admin']),
    allow.group('Moderator').to(['read', 'update'])
  ]),

  UserReactions: a.model({
    id: a.id().required(),
    userId: a.id().required(),
    titleId: a.string().required(),
    reactionType: a.enum(['Like', 'Dislike']),
    createdAt: a.datetime(),
    // Relationships
    user: a.belongsTo('Users', 'userId')
  })
  .authorization(allow => [
    allow.owner(),
    allow.groups(['Admin']),
    allow.group('Moderator').to(['read', 'update'])
  ]),

  UserWatchHistories: a.model({
    id: a.id().required(),
    userId: a.id().required(),
    titleId: a.string().required(),
    progress: a.integer().required(),
    duration: a.integer().required(),
    lastWatchedAt: a.datetime().required(),
    deviceInfo: a.json(),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
    // Relationships
    user: a.belongsTo('Users', 'userId')
  })
  .authorization(allow => [
    allow.owner(),
    allow.groups(['Admin']),
    allow.group('Moderator').to(['read', 'update'])
  ]),

  UserLogs: a.model({
    id: a.id().required(),
    userId: a.id(),
    action: a.string().required(),
    entityType: a.string(),
    entityId: a.string(),
    ipAddress: a.string(),
    userAgent: a.string(),
    metadata: a.json(),
    createdAt: a.datetime(),

    // Relationships
    user: a.belongsTo('Users', 'userId')
  })
  .authorization(allow => [
    allow.owner(),
    allow.groups(['Admin']),
    allow.group('Moderator').to(['read', 'update'])
  ]),

  UserNotifications: a.model({
    id: a.id().required(),
    userId: a.id().required(),
    title: a.string().required(),
    message: a.string().required(),
    type: a.enum(['System', 'Payment', 'Titles', 'Promotional']),
    isRead: a.boolean().default(false),
    relatedId: a.string(),
    relatedType: a.string(),
    createdAt: a.datetime(),
    readAt: a.datetime(),

    // Relationships
    user: a.belongsTo('Users', 'userId')
  })
  .authorization(allow => [
    allow.owner(),
    allow.groups(['Admin']),
    allow.group('Moderator').to(['read', 'update'])
  ]),

}).authorization(allow => [allow.authenticated()]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});