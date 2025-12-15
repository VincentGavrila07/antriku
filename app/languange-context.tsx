"use client";

import { createContext, useContext, useState, useEffect } from "react";

export interface Translations {
  Sidebar: {
    appName: string;
    adminDashboard: string;
    userManagement: string;
    user: string;
    role: string;
    permission: string;
    reports: string;
    service: string;
    staffDashboard: string;
    orders: string;
    history: string;
    display: string;
    myDashboard: string;
    profile: string;
    logout: string;
  };
  display: {
    title: string;
    loading: string;
    nowServing: string;
    next: string;
    dash: string;
  };
  Forbidden: {
    Forbidden: string;
    Sorry: string;
  };
  welcome: {
    welcome: string;
  };
  userManagement: {
    // General
    ListUser: string;
    ListPermission: string;
    profile: {
      EditProfile: string;
      changePass: string;
      name: string;
      NewPass: string;
      ConfirmPass: string;
      Save: string;
    };
    report: {
      GenerateServiceReport: string;
      GenerateReport: string;
      Keterangan: string;
      OpenManually: string;
    };
    service: {
      page: {
        ListService: string;
        AddLayanan: string;
        EditService: string;
      };
      AddService: {
        Name: string;
        ServiceCode: string;
        Description: string;
        AssignStaf: string;
        EstimatedTime: string;
        Save: string;
      };
    };
    ListRole: string;
    EditPermission: string;
    PermissionInfo: string;
    Name: string;
    Slug: string;
    AssignRoles: string;
    Save: string;
    Loading: string;
    Forbidden: string;
    // Permission
    SuccessUpdate: string;
    SuccessUpdateDesc: string;
    ErrorUpdate: string;
    ErrorUpdateDesc: string;
    ErrorLoad: string;
    ErrorLoadDesc: string;
    // Role management
    EditRole: string;
    AddRole: string;
    RoleName: string;
    RoleNameRequired: string;
    RoleNamePlaceholder: string;
    SuccessAddRole: string;
    SuccessEditRole: string;
    ErrorAddRole: string;
    ErrorEditRole: string;
    ErrorAddRoleDesc: string;
    ErrorEditRoleDesc: string;
    ErrorLoadRole: string;
    ErrorLoadRoleDesc: string;
    SuccessDeleteRole: string;
    ErrorDeleteRole: string;
    ErrorDeleteRoleDesc: string;
    DeleteRoleConfirmTitle: string;
    DeleteRoleConfirmText: string;
    DeleteRoleConfirmOk: string;
    DeleteRoleConfirmCancel: string;
    // User detail
    UserDetail: string;
    AddUser: string;
    EditUser: string;
    UserId: string;
    UserName: string;
    UserEmail: string;
    UserRole: string;
    UserPassword: string;
    UserPasswordPlaceholder: string;
    UserPasswordRequired: string;
    SuccessAddUser: string;
    SuccessEditUser: string;
    ErrorAddUser: string;
    ErrorEditUser: string;
    ErrorAddUserDesc: string;
    ErrorEditUserDesc: string;
    ErrorLoadUser: string;
    ErrorLoadUserDesc: string;
    SuccessDeleteUser: string;
    ErrorDeleteUser: string;
    ErrorDeleteUserDesc: string;
    DeleteUserConfirmTitle: string;
    DeleteUserConfirmText: string;
    DeleteUserConfirmOk: string;
    DeleteUserConfirmCancel: string;
    SearchByName: string;
  };
  order: {
    OrderService: string;
    SuccessBooking: string;
    QueueNumber: string;
    ErrorBooking: string;
    ActiveQueueExists: string;
    InvalidUserOrService: string;
    PleaseRelogin: string;
    BookingTitle: string;
    Book: string;
    SelectStaff: string;
    SelectStaffRequired: string;
    ArrivalDate: string;
    ArrivalDateRequired: string;
  };
  serviceHistory: {
    Service: string;
    ServiceHistory: string;
    ErrorLoadServiceHistory: string;
    ErrorLoadServiceHistoryDesc: string;
    Status: string;
    Waiting: string;
    Completed: string;
    Cancelled: string;
    QueueDate: string;
  };
  dashboard: {
    ErrorLoadDashboard: string;
    Loading: string;
    AdminDashboard: string;
    Welcome: string;
    Administrator: string;
    ServerTime: string;
    TotalPatients: string;
    Growth: string;
    TotalStaff: string;
    ActiveDoctors: string;
    TodayQueues: string;
    BusySmooth: string;
    ActiveServices: string;
    ServiceStatusAndQueue: string;
    SearchServiceOrStaff: string;
    ServiceName: string;
    Status: string;
    Staff: string;
    Queue: string;
    People: string;
    Open: string;
    Break: string;
    Closed: string;
    Online: string;
    Busy: string;
    Offline: string;
    PatientDashboard: string;
    WelcomeBack: string;
    YourActiveQueue: string;
    QueueNumber: string;
    WaitingProcess: string;
    InProcess: string;
    Service: string;
    Estimate: string;
    BeingServed: string;
    NoActiveQueue: string;
    ServiceList: string;
    Information: string;
    Latest: string;
    RainySeasonHealth: string;
    ImmunityTips: string;
    MyProfile: string;
    RegularPatient: string;
    Verified: string;
    Email: string;
    PhoneNumber: string;
    ViewProfileDetail: string;
    NoInitialNote: string;
    StaffDashboard: string;
    CurrentSession: string;
    InitialComplaint: string;
    FinishQueue: string;
    NoPatientInService: string;
    StartQueue: string;
    NoQueue: string;
    MyQueue: string;
    Next: string;
    TotalServingToday: string;
    AllServices: string;
    Notes: string;
    BreakNote: string;
    MonthlyMeeting: string;
    NewNotePlaceholder: string;
    CheckIn: string;
    NotAssigned: string;
    ServiceCode: string;
    Unknown: string;
  };
  service: {
    Services: string;
    AddService: string;
    EditService: string;
    ServiceName: string;
    ServiceNameRequired: string;
    ServiceNamePlaceholder: string;
    ServiceCode: string;
    ServiceCodeRequired: string;
    ServiceCodePlaceholder: string;
    Description: string;
    DescriptionPlaceholder: string;
    AssignStaff: string;
    AssignStaffPlaceholder: string;
    AssignStaffEditPlaceholder: string;
    EstimatedTime: string;
    IsActive: string;
    Save: string;
    SuccessAddService: string;
    SuccessEditService: string;
    ErrorAddService: string;
    ErrorEditService: string;
    ErrorLoadUser: string;
    ErrorLoadService: string;
    ErrorLoadServiceTitle: string;
    ErrorLoadServiceDesc: string;
    SuccessDeleteService: string;
    ErrorDeleteServiceTitle: string;
    ErrorDeleteServiceDesc: string;
    DeleteServiceConfirmTitle: string;
    DeleteServiceConfirmText: string;
    DeleteServiceConfirmOk: string;
    DeleteServiceConfirmCancel: string;
    ListService: string;
    SearchByNameService: string;
    AddServiceButton: string;
  };
  profile: {
    EditProfile: string;
    Name: string;
    NameRequired: string;
    NamePlaceholder: string;
    ChangePassword: string;
    NewPassword: string;
    NewPasswordMin: string;
    NewPasswordPlaceholder: string;
    ConfirmCurrentPassword: string;
    ConfirmCurrentPasswordRequired: string;
    ConfirmCurrentPasswordPlaceholder: string;
    Save: string;
    SuccessEditProfile: string;
    ErrorEditProfile: string;
    ErrorEditProfileDesc: string;
    MyProfile: string;
  };
  reports: {
    GenerateServiceReport: string;
    SelectDatePlaceholder: string;
    GenerateReport: string;
    WarningTitle: string;
    WarningDesc: string;
    SuccessTitle: string;
    SuccessDesc: string;
    ErrorTitle: string;
    ErrorDesc: string;
    OpenManually: string;
    HelperText: string;
  };
  tables: {};
}

interface LanguageContextType {
  lang: string;
  translations: Translations | null;
  loading: boolean;
  changeLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<string>("en");
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTranslations = async (selectedLang: string) => {
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/translations?lang=${selectedLang}`
      );
      const data = await res.json();

      setTranslations(data);
      localStorage.setItem("translations", JSON.stringify(data));
      localStorage.setItem("lang", selectedLang);
    } catch (err) {
      console.error("Error fetch translations:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load first time from storage
  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "en";
    const storedTranslations = localStorage.getItem("translations");

    setLang(storedLang);

    if (storedTranslations) {
      setTranslations(JSON.parse(storedTranslations));
      setLoading(false);
    } else {
      fetchTranslations(storedLang);
    }
  }, []);

  // Fetch only when language actually changed
  useEffect(() => {
    const stored = localStorage.getItem("translations");
    if (!stored || JSON.parse(stored).lang !== lang) {
      fetchTranslations(lang);
    }
  }, [lang]);

  const changeLanguage = (newLang: string) => {
    if (newLang !== lang) {
      setLoading(true);
      setLang(newLang);
    }
  };

  return (
    <LanguageContext.Provider
      value={{ lang, translations, loading, changeLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be in provider");
  return ctx;
};
