import React, { FC, lazy } from 'react';

const AdminPage = lazy(() => import('./admin/AdminPanel'));
const Admin: FC = () => {
  return <AdminPage />;
};

const AuthenticationFormPage = lazy(() => import('./AuthenticationForm'));
const AuthenticationForm: FC = () => {
  return <AuthenticationFormPage />;
};

const HomePage = lazy(() => import('./Home'));
const Home: FC = () => {
  return <HomePage />;
};

const AddChildPageLazy = lazy(
  () => import('./Player/dashboard/child/AddChildPage')
);
const AddChildPage: FC = () => {
  return <AddChildPageLazy />;
};

const EditChildPageLazy = lazy(
  () => import('./Player/dashboard/child/EditChildPage')
);
const EditChildPage: FC = () => {
  return <EditChildPageLazy />;
};

const LandingPagePage = lazy(() => import('./LandingPage'));
const LandingPage: FC = () => {
  return <LandingPagePage />;
};

const CoachProfilePage = lazy(() => import('./CoachProfile/index'));
const CoachProfile: FC = () => {
  return <CoachProfilePage />;
};

const SignUpPage = lazy(() => import('./SignUp'));
const SignUp: FC = () => {
  return <SignUpPage />;
};

const ViewEventPage = lazy(() => import('./Event/ViewEvent'));
const ViewEvent: FC = () => {
  return <ViewEventPage />;
};

const DeleteEventPage = lazy(() => import('./Event/DeleteEvent'));
const DeleteEvent: FC = () => {
  return <DeleteEventPage />;
};

const CheckoutCallbackPage = lazy(() => import('./Event/CheckoutCallback'));
const CheckoutCallback: FC = () => {
  return <CheckoutCallbackPage />;
};

const PlayerDashboardPage = lazy(() => import('./Player/index'));
const PlayerDashboard: FC = () => {
  return <PlayerDashboardPage />;
};

const CoachesPage = lazy(() => import('./Coaches/index'));
const Coaches: FC = () => {
  return <CoachesPage />;
};

const FaqPage = lazy(() => import('./ContentTemplates/Faq'));
const Faq: FC = () => {
  return <FaqPage />;
};

const NewsPage = lazy(() => import('./ContentTemplates/News'));
const News: FC = () => {
  return <NewsPage />;
};

const KeysToCoachingPage = lazy(
  () => import('./ContentTemplates/KeysToCoaching')
);
const KeysToCoaching: FC = () => {
  return <KeysToCoachingPage />;
};

const CharityPage = lazy(() => import('./ContentTemplates/Charity'));
const Charity: FC = () => {
  return <CharityPage />;
};

const SportsPartnerPage = lazy(
  () => import('./ContentTemplates/SportsPartner')
);
const SportsPartner: FC = () => {
  return <SportsPartnerPage />;
};

const RequestPasswordChangePage = lazy(() => import('./RequestPasswordChange'));
const RequestPasswordChange: FC = () => {
  return <RequestPasswordChangePage />;
};

const ChangePasswordPage = lazy(() => import('./ChangePassword'));
const ChangePassword: FC = () => {
  return <ChangePasswordPage />;
};

const RecruitingGuidePage = lazy(
  () => import('./ContentTemplates/RecruitingGuide')
);
const RecruitingGuide: FC = () => {
  return <RecruitingGuidePage />;
};

const SoccerPage = lazy(() => import('./ContentTemplates/Soccer'));
const Soccer: FC = () => {
  return <SoccerPage />;
};

const InflcrPage = lazy(() => import('./Inflcr'));
const Inflcr: FC = () => {
  return <InflcrPage />;
};

const LiabilityPage = lazy(() => import('./Liability'));
const Liability: FC = () => {
  return <LiabilityPage />;
};

const PrivacyPolicyPage = lazy(() => import('./PrivacyPolicy'));
const PrivacyPolicy: FC = () => {
  return <PrivacyPolicyPage />;
};

const TermsOfServicePage = lazy(() => import('./TermsOfService'));
const TermsOfService: FC = () => {
  return <TermsOfServicePage />;
};

const TestimonialsPage = lazy(() => import('./Testimonials'));
const Testimonials: FC = () => {
  return <TestimonialsPage />;
};

const BlogPage = lazy(() => import('./Blog/BlogPosts'));
const Blog: FC<{ match: any }> = (props) => {
  return <BlogPage {...props} />;
};

const BlogPostPage = lazy(() => import('./Blog/BlogPost'));
const BlogPost: FC<{ match: any }> = (props) => {
  return <BlogPostPage {...props} />;
};

export {
  AuthenticationForm,
  Admin,
  Blog,
  BlogPost,
  Home,
  Inflcr,
  LandingPage,
  CoachProfile,
  SignUp,
  ViewEvent,
  DeleteEvent,
  PrivacyPolicy,
  CheckoutCallback,
  PlayerDashboard,
  Faq,
  Coaches,
  Liability,
  News,
  KeysToCoaching,
  Charity,
  ChangePassword,
  RequestPasswordChange,
  Testimonials,
  TermsOfService,
  RecruitingGuide,
  Soccer,
  SportsPartner,
  AddChildPage,
  EditChildPage,
};
