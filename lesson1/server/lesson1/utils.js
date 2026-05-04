let formatPhoneNumber = (str) => {
  //Filter only numbers from the input
  let cleaned = ("" + str).replace(/\D/g, "");
  //Check if the input is of correct length
  let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return null;
};

// cú pháp xuất
// module.exports = hàm hoặc giá trị nào muốn xuất để các file khác có thể sử dụng
// ví dụ:
// module.exports = {
//  formatPhoneNumber
// };
// trường hợp chỉ muốn export cụ thể 1 giá trị nào đó, ta chỉ cần dùng cú pháp
// export giá trị cần export

export const PI = 3.14;

export default formatPhoneNumber;
