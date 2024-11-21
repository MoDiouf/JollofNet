// src/user/interfaces/network.interface.ts

export interface Network {
    essid: string | null;
    encryptionType: string | null;
    essidHideEnabled: boolean;
    essidHideValue: string | null;
    enableChecked: boolean;
    frequency : string;
    enableValue: string | null;
    password: string | null;
    
  }
  