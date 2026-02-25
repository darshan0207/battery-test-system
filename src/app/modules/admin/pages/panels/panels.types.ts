interface EnumServiceItem {
    ip: string;
    port: Number;
}

export interface Panel {
    _id: string;
    panel_name: string;
    ip_address?: Array<EnumServiceItem>;
    active: boolean;
}
