export type BlockType =
  | 'header'
  | 'hero_image'
  | 'text'
  | 'two_column'
  | 'three_column'
  | 'button'
  | 'divider'
  | 'spacer'
  | 'product_card'
  | 'signature'
  | 'footer'
  | 'custom_html';

export type EmailFontFamily =
  | 'Arial, Helvetica, sans-serif'
  | 'Helvetica, Arial, sans-serif'
  | 'Georgia, serif'
  | '"Times New Roman", Times, serif'
  | '"Trebuchet MS", Helvetica, sans-serif'
  | 'Verdana, Geneva, sans-serif'
  | 'Tahoma, Geneva, sans-serif'
  | '"Courier New", Courier, monospace';

export interface ExtractedAsset {
  id: string;
  label: string;
  category: 'logo' | 'signature' | 'stamp' | 'banner' | 'icon' | 'other';
  dataUrl: string;
  width: number;
  height: number;
  createdAt: number;
}

export interface DetectedElement {
  id: string;
  label: string;
  box2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax] 0-1000
  description: string;
  category: 'logo' | 'signature' | 'stamp' | 'banner' | 'icon' | 'other';
}

export interface HeaderBlockData {
  logoUrl: string;
  logoAlt: string;
  logoWidth: number;
  align: 'left' | 'center' | 'right';
  paddingTop: number;
  paddingBottom: number;
  viewOnlineText?: string;
  viewOnlineUrl?: string;
}

export interface HeroImageBlockData {
  imageUrl: string;
  altText: string;
  linkUrl?: string;
  caption?: string;
  fullWidth: boolean;
  paddingTop: number;
  paddingBottom: number;
}

export interface TextBlockData {
  title?: string;
  titleSize?: number;
  titleColor?: string;
  subtitle?: string;
  content: string;
  textColor?: string;
  fontFamily?: EmailFontFamily;
  fontWeight?: 'normal' | 'bold';
  align: 'left' | 'center' | 'right' | 'justify';
  lineHeight: number;
  fontSize: number;
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
}

export interface ColumnData {
  imageUrl?: string;
  title?: string;
  content: string;
  buttonText?: string;
  buttonUrl?: string;
}

export interface TwoColumnBlockData {
  col1: ColumnData;
  col2: ColumnData;
  col1WidthPercent: number; // default 50
  stackOnMobile: boolean;
  paddingTop: number;
  paddingBottom: number;
}

export interface ThreeColumnBlockData {
  col1: ColumnData;
  col2: ColumnData;
  col3: ColumnData;
  stackOnMobile: boolean;
  paddingTop: number;
  paddingBottom: number;
}

export interface ButtonBlockData {
  text: string;
  url: string;
  buttonColor: string;
  textColor: string;
  borderRadius: number;
  align: 'left' | 'center' | 'right';
  paddingTop: number;
  paddingBottom: number;
  buttonPaddingY: number;
  buttonPaddingX: number;
  fullWidthMobile: boolean;
  fontSize: number;
  bold: boolean;
}

export interface DividerBlockData {
  style: 'solid' | 'dashed' | 'dotted';
  color: string;
  thickness: number;
  widthPercent: number;
  paddingTop: number;
  paddingBottom: number;
}

export interface SpacerBlockData {
  height: number;
}

export interface ProductCardBlockData {
  imageUrl: string;
  badge?: string;
  title: string;
  price: string;
  originalPrice?: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  buttonColor: string;
  cardBackground: string;
  paddingTop: number;
  paddingBottom: number;
}

export interface SignatureBlockData {
  name: string;
  title: string;
  company: string;
  signatureImageUrl?: string; // Cropped handwritten signature!
  stampImageUrl?: string;     // Cropped stamp/seal/cachet!
  phone?: string;
  email?: string;
  website?: string;
  align: 'left' | 'center' | 'right';
  paddingTop: number;
  paddingBottom: number;
}

export interface FooterBlockData {
  companyName: string;
  address: string;
  unsubscribeText: string;
  unsubscribeUrl: string;
  privacyText?: string;
  privacyUrl?: string;
  copyright: string;
  textColor: string;
  showSocials: boolean;
  socials?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    website?: string;
  };
  paddingTop: number;
  paddingBottom: number;
}

export interface CustomHtmlBlockData {
  html: string;
  paddingTop: number;
  paddingBottom: number;
}

export type BlockDataMap = {
  header: HeaderBlockData;
  hero_image: HeroImageBlockData;
  text: TextBlockData;
  two_column: TwoColumnBlockData;
  three_column: ThreeColumnBlockData;
  button: ButtonBlockData;
  divider: DividerBlockData;
  spacer: SpacerBlockData;
  product_card: ProductCardBlockData;
  signature: SignatureBlockData;
  footer: FooterBlockData;
  custom_html: CustomHtmlBlockData;
};

export interface EmailBlock<T extends BlockType = BlockType> {
  id: string;
  type: T;
  data: BlockDataMap[T];
  backgroundColor?: string;
}

export interface GlobalEmailSettings {
  backgroundColor: string; // Outer wrapper (e.g. #f4f6f8)
  containerColor: string;   // Inner card (e.g. #ffffff)
  maxWidth: number;         // 600 or 650
  fontFamily: EmailFontFamily;
  textColor: string;
  linkColor: string;
}

export interface ImportedDocument {
  name: string;
  type: 'image' | 'pdf' | 'html';
  dataUrl: string;
  width: number;
  height: number;
  rawText?: string;
  detectedElements?: DetectedElement[];
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  preheader: string;
  recipientEmail: string;
  globalSettings: GlobalEmailSettings;
  blocks: EmailBlock[];
  importedDocument?: ImportedDocument;
  extractedAssets: ExtractedAsset[];
  createdAt: number;
  updatedAt: number;
}

export interface AuditIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  category: 'links' | 'images' | 'compatibility' | 'accessibility';
  message: string;
  detail: string;
  blockId?: string;
}

export interface AuditReport {
  score: number;
  passedCount: number;
  issues: AuditIssue[];
  gmailCompatible: boolean;
  outlookCompatible: boolean;
  mobileResponsive: boolean;
}
